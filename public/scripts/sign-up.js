document
  .getElementById("signup-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault(); // Prevent page reload

    // Collect the form values
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch(`${config.API_BASE_URL}/sign-up`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
        }),
      });

      const result = await response.json();

      // Display result message based on the response
      const resultMessage = document.getElementById("result-message");
      if (response.ok) {
        resultMessage.style.color = "green";
        resultMessage.style.display = "block";
        resultMessage.textContent = result.message; // Sign-up successful
        window.location.href = "./log-in.html";
      } else {
        resultMessage.style.color = "red";
        resultMessage.style.display = "block";
        resultMessage.textContent = result.message; // Show error message
      }
    } catch (error) {
      console.error("Error during sign-up:", error);
      document.getElementById("result-message").textContent =
        "An error occurred during sign-up. Please try again.";
    }
  });
