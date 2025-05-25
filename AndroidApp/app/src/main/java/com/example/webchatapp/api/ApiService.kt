package com.example.webchatapp.api

import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.POST

data class RegisterRequest(val username: String, val email: String, val password: String)

interface ApiService {
    @POST("api/register/")
    fun register(@Body request: RegisterRequest): Call<Void>
}
