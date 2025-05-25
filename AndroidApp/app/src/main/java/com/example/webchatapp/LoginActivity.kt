package com.example.webchatapp

import android.content.Intent
import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import org.json.JSONObject
import java.io.IOException
import okhttp3.RequestBody.Companion.toRequestBody

class LoginActivity : AppCompatActivity() {

    private val client = OkHttpClient()
    private val loginUrl = "http://10.0.2.2:8000/api/login/"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        val usernameInput = findViewById<EditText>(R.id.username_input)
        val passwordInput = findViewById<EditText>(R.id.password_input)
        val loginBtn = findViewById<Button>(R.id.login_button)
        val GoToRegister = findViewById<Button>(R.id.goregister_button)

        loginBtn.setOnClickListener {
            val username = usernameInput.text.toString()
            val password = passwordInput.text.toString()

            val json = JSONObject()
            json.put("username", username)
            json.put("password", password)

            val mediaType = "application/json".toMediaTypeOrNull()
            val body = json.toString().toRequestBody(mediaType)
            val request = Request.Builder()
                .url(loginUrl)
                .post(body)
                .build()

            client.newCall(request).enqueue(object : Callback {
                override fun onFailure(call: Call, e: IOException) {
                    runOnUiThread {
                        Toast.makeText(this@LoginActivity, "Network error: ${e.message}", Toast.LENGTH_LONG).show()
                    }
                }

                override fun onResponse(call: Call, response: Response) {
                    runOnUiThread {
                        if (response.isSuccessful) {
                            val responseBody = response.body?.string()
                            val responseJson = JSONObject(responseBody ?: "")
                            val token = responseJson.getString("token")
                            val username = responseJson.getString("username")
                            val email = responseJson.getString("email")

                            //Зберігаємо токен
                            val sharedPref = getSharedPreferences("auth", MODE_PRIVATE)
                            with(sharedPref.edit()) {
                                putString("token", token)
                                putString("username", username)
                                putString("email", email)
                                apply()
                            }

                            Toast.makeText(this@LoginActivity, "Login successful", Toast.LENGTH_SHORT).show()
                            // Перехід на головну сторінку
                            startActivity(Intent(this@LoginActivity, MainActivity::class.java))
                        } else {
                            Toast.makeText(this@LoginActivity, "Login failed", Toast.LENGTH_SHORT).show()
                        }
                    }
                }
            })
        }

        GoToRegister.setOnClickListener {
            startActivity(Intent(this@LoginActivity, RegisterActivity::class.java))
        }
    }
}