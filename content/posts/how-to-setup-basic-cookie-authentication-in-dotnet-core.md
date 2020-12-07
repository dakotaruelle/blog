---
title: How to Setup Basic Cookie Authentication in .NET Core
---

## Overview
This article is going to walk through setting up simple authentication in .NET Core. It won't focus on creating and managing users, but rather configuring the middleware that allows for authentication.

The repository containing the final result can be found [here](https://github.com/dakotaruelle-tutorials/how-to-setup-basic-cookie-auth-in-dotnet-core).

## Prerequisites
The latest [.NET Core SDK](https://dotnet.microsoft.com/download/dotnet-core). At the time of this writing it's .NET 5, but .NET Core 2 and 3 will work as well.

## Getting Started
The first step is to create a new .NET Core project. In your favorite terminal, run the following command 
```shell
dotnet new mvc -o webapp
``` 
This will create a new .NET application based off the `mvc` template and will put it in a directory called `webapp`. Once it completes, open the project in your favorite editor and you should have a directory structure that looks like this

![](/how-to-setup-basic-cookie-authentication-in-dotnet-core/directoryStructure.png)

## Adding Authentication Middleware
Open the `Startup.cs` file located in the root of the project. This file is where middleware is configured and added to the application. Find the method called `ConfigureServices` and add the following code

```csharp[Startup.cs]
services.AddAuthentication("cookieAuth")
    .AddCookie("cookieAuth", options => {
        options.LoginPath = "/Home/Login";
    });
```

Afterward, the `ConfigureServices` method should look like this

```csharp[Startup.cs]
public void ConfigureServices(IServiceCollection services)
 {
    services.AddControllersWithViews();

    services.AddAuthentication("cookieAuth")
        .AddCookie("cookieAuth", options =>
        {
            options.LoginPath = "/Home/Login";
        });
 }
```

The call to `services.AddAuthentication` registers authentication with the middleware pipeline. It's being passed a string of `"cookieAuth"`, which sets the default authentication method (called a scheme) to the cookie authentication that's added next. The call to `AddCookie` adds a new cookie authentication scheme called `"cookieAuth"`. The string can be anything, it just sets the name of this particular cookie authentication so other things can refer to it (like setting the default scheme in `AddAuthentication`). The `AddCookie` method can also take a lambda function to configure different options. In this case, the `LoginPath` is being set to `"/Home/Login"`. If a user tries to access a page that requires authentication, they will be redirected to this page to login.

Now, authentication is configured, but the middleware pipeline still needs to be told to use it. To do this, find the `Configure` method inside of `Startup.cs` and add the following line

```csharp[Startup.cs]
app.UseAuthentication();
```

Afterwards, it should look like this

```csharp[Startup.cs]
app.UseRouting();

 app.UseAuthentication();

 app.UseAuthorization();
```

## Creating a Login Page
With authentication configured, the next step is to create a login page. Go to the `Views/Home` folder and add a file called `Login.cshtml` with the following code.

```html[Login.cshtml]
 
<div class="row">
    <div class="col-3">
        <form method="post" action="/Home/Login">
            <div class="form-group">
                <label for="username">Username</label>
                <input name="username" class="form-control" />
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input name="password" type="password" class="form-control" />
            </div>
            <button class="btn btn-primary" type="submit">Login</button>
        </form>
    </div>
</div>
```

Next, we need to add a method to the `HomeController` that will return the new login page. In `Controllers/HomeController.cs`, add this method
```csharp[HomeController.cs]
 
public IActionResult Login()
{
  return View();
}
```

Lastly, a link to the login page needs to be added to the layout page. In `Views/Shared/Layout.cshtml`, add the following lines after the link to the privacy page

```html[Layout.cshtml]
 
<li class="nav-item">
    <a class="nav-link text-dark" asp-area="" asp-controller="Home" asp-action="Login">Login</a>
</li>
```

Afterwards, you should have a section that looks like this
```html[Layout.cshtml]
 
<div class="navbar-collapse collapse d-sm-inline-flex justify-content-between">
    <ul class="navbar-nav flex-grow-1">
        <li class="nav-item">
            <a class="nav-link text-dark" asp-area="" asp-controller="Home" asp-action="Index">Home</a>
        </li>
        <li class="nav-item">
            <a class="nav-link text-dark" asp-area="" asp-controller="Home" asp-action="Privacy">Privacy</a>
        </li>
        <li class="nav-item">
            <a class="nav-link text-dark" asp-area="" asp-controller="Home" asp-action="Login">Login</a>
        </li>
    </ul>
</div>
```

Now it's time to run the app! In your terminal, in the same directory as the `webapp.csproj` file, run the command

```shell
dotnet run
```

This will build and launch the project. Then in a web browser you can go to `http://localhost:5000` or `https://localhost:5001` and see the app. Click on the top link that says "Login" and it should bring you to a page that looks like this

![](/how-to-setup-basic-cookie-authentication-in-dotnet-core/loginView.png)

## Logging in
The next step is to create a controller action that will handle authenticating a user. In `HomeController.cs` add this method

```csharp[HomeController.cs]
 
[HttpPost]
public async Task<IActionResult> Login(string username, string password)
{
    if (username == password)
    {
        var claims = new List<Claim>
        {
          new Claim("sub", username),
        };

        var claimsIdentity = new ClaimsIdentity(claims, "password");
        var claimsPrincipal = new ClaimsPrincipal(claimsIdentity);

        await HttpContext.SignInAsync("cookieAuth", claimsPrincipal);

        return RedirectToAction("Index");
    }

    return Unauthorized();
}
```

You will also need to add the `System.Security.Claims` and `Microsoft.AspNetCore.Authentication` namespaces.

The above controller action is where the form on our login page is going to submit the entered username and password. This is where we then validate that there is a user with the supplied credentials. For the purposes of this tutorial, we are simply checking that the username and password are the same. However, in a real application you would most likely check a database for an existing user based on the username, and then hash the password to verify it.

After a user has been properly authenticated, the next step is to issue "claims". A claim is a fancy word that simply means a piece of info about a user. As far as the code is concerned, it's a simple key value pair. In our example, we issue one claim called "sub" with a value of the supplied username. The term "sub" is a common name in the authentication world to indicate a user's username.

After creating the list of claims, we can use it to create a `ClaimsIdentity`. This is a wrapper around a list of claims with a bit more information. The other argument to the `ClaimsIdentity` constructor, "password", simply indicates that a user used a password to sign in.

Once we have a `ClaimsIdentity`, we can use it to create a `ClaimsPrincipal`, which is a wrapper around a `ClaimsIdentity` with some metadata for the framework to know how to manage a signed in user.

The last step is to make a call to `HttpContext.SignInAsync` and pass it the authentication scheme we want to use to sign a user in, and the `ClaimsPrinicipal` that represents the signed in user. `SignInAsync` is an extension method on `HttpContext` that will take care of all the behind the scenes work of putting relevant information about the signed in user into the cookie, and then actually issuing that cookie to the user's browser. Once the user has a cookie, they will be authenticated on all future requests and will not need to sign in again.

If we run the application now and sign in, we should be redirected back to the home page. If we then open the browser dev tools we can see the cookie issued by our application.

![](/how-to-setup-basic-cookie-authentication-in-dotnet-core/cookie.png)

## Creating an Authenticated route
The last thing we need in our application is a page that requires authentication to view it. For this purpose, let's create a page that displays a user's claims.

In the `Home/Views` directory add a file called `Claims.cshtml` and put the following code in it

```html[Claims.cshtml]
 
<h1 style="margin-bottom: 20px">Claims</h1>
@foreach (var claim in User.Claims)
{
  <div style="margin-bottom: 5px">
    <b>@claim.Type: </b>
    <span>@claim.Value</span>
  </div>
}
```

Then, in `HomeController.cs` add the following method along with a reference to the `Microsoft.AspNetCore.Authorization` namespace.

```csharp[HomeController.cs]
 
[Authorize]
public IActionResult Claims()
{
  return View();
}
```

The key here is the `[Authorize]` tag. This tells the framework that only authenticated users should be able to see this view. If a user is not authenticated, they will be redirected to `/Home/Login`, the route we set up back in `Startup.cs`.

Lastly, we should add a link to the claims page in `Layout.cshtml`.

```html[Claims.cshtml]
 
<li class="nav-item">
    <a class="nav-link text-dark" asp-area="" asp-controller="Home" asp-action="Claims">Claims</a>
</li>
```

Now, if we run the application and navigate to the claims page we should see this

![](/how-to-setup-basic-cookie-authentication-in-dotnet-core/claims.png)

And if we try to access the claims page while we are not authenticated (either delete your cookie or open the app in a private browser windo) we should get redirected to the login page.

![](/how-to-setup-basic-cookie-authentication-in-dotnet-core/loginViewWithReturnUrl.png)
