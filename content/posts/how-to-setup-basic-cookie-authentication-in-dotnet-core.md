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
