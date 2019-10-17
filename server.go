package main

import (
    "github.com/labstack/echo"
    "github.com/labstack/echo/middleware"
)

const (
    basicAuthUser = "panasonic"
    basicAuthPassword = "panasonic"
)

func main() {
    e := echo.New()
    e.Use(middleware.BasicAuth(func(username, password string, c echo.Context) (bool, error) {
        if username == basicAuthUser && password == basicAuthPassword {
            return true, nil
        }
        return false, nil
    }))
    e.Static("/", "build/")
    e.Logger.Fatal(e.Start(":8080"))
    // http.HandleFunc(
    //     "/login",
    //     func(w http.ResponseWriter, r *http.Request) {
    //         if user, pass, ok := r.BasicAuth(); !ok || user != basicAuthUser || pass != basicAuthPassword {
    //             w.Header().Add("WWW-Authenticate", `Basic realm="my private area"`)
    //             w.WriteHeader(http.StatusUnauthorized) // 401
    //             http.Error(w, "Not authorized", 401)
    //             return
    //         }
    //         // http.Redirect(w, r, "/index.html", 301)
    //     },
    // )
}
