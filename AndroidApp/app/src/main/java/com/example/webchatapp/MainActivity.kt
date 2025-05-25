package com.example.webchatapp

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val prefs = getSharedPreferences("auth", Context.MODE_PRIVATE)
        val username = prefs.getString("username", "N/A")
        val email = prefs.getString("email", "N/A")
        val token = prefs.getString("token", "N/A")

        val usernameText = findViewById<TextView>(R.id.username_text)
        val emailText = findViewById<TextView>(R.id.email_text)
        val tokenText = findViewById<TextView>(R.id.token_text)
        val logoutBtn = findViewById<Button>(R.id.logout_button)

        usernameText.text = "Username: $username"
        emailText.text = "Email: $email"
        tokenText.text = "Token: $token"

        logoutBtn.setOnClickListener {
            prefs.edit().clear().apply()
            startActivity(Intent(this, LoginActivity::class.java))
            finish()
        }
    }
}
