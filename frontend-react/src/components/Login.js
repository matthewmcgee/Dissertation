import React from "react";

// NEED TO HANDLE STATE!!!
const Login = () => {
    return (
        <div class="container">
            <h2>Login</h2>
            <p>Please login to make an appointment</p>

            {/* form for user to login */}
            <div class="half userinput">
                <form method="" action="">
                    <input type="email" name="email" class="stack" placeholder="Email"  />
                    <input type="password" name="password" class="stack" placeholder="Password" />
                    <button class="stack icon-paper-plane">Login</button>
                </form>
            </div>
        </div>
    )
}

export default Login;