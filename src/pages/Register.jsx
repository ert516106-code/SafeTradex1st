            <div className="mb-8">

              <button
                onClick={() => setStep(1)}
                className="text-sky-400 text-sm mb-6"
              >
                ← Back
              </button>

              <h1 className="text-4xl font-bold">
                Create Account
              </h1>

              <p className="text-slate-400 mt-3">
                Join SafeTradex and start your trading journey.
              </p>

            </div>

            <div className="rounded-3xl bg-[#0C1828] border border-slate-800 p-6 space-y-5">

              <div>

                <label>Full Name</label>

                <div className="relative mt-2">

                  <User
                    className="absolute left-4 top-4 text-slate-400"
                    size={18}
                  />

                  <input
                    value={fullName}
                    onChange={(e)=>setFullName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full h-12 rounded-xl bg-[#101E31] border border-slate-700 pl-12 pr-4"
                  />

                </div>

              </div>

              <div>

                <label>Username</label>

                <div className="relative mt-2">

                  <Users
                    className="absolute left-4 top-4 text-slate-400"
                    size={18}
                  />

                  <input
                    value={username}
                    onChange={(e)=>setUsername(e.target.value)}
                    placeholder="johndoe"
                    className="w-full h-12 rounded-xl bg-[#101E31] border border-slate-700 pl-12 pr-4"
                  />

                </div>

              </div>

              <div>

                <label>Email</label>

                <div className="relative mt-2">

                  <Mail
                    className="absolute left-4 top-4 text-slate-400"
                    size={18}
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full h-12 rounded-xl bg-[#101E31] border border-slate-700 pl-12 pr-4"
                  />

                </div>

              </div>

              <div>

                <label>Password</label>

                <div className="relative mt-2">

                  <Lock
                    className="absolute left-4 top-4 text-slate-400"
                    size={18}
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    className="w-full h-12 rounded-xl bg-[#101E31] border border-slate-700 pl-12 pr-12"
                  />

                  <button
                    type="button"
                    onClick={()=>setShowPassword(!showPassword)}
                    className="absolute right-4 top-3"
                  >
                    {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                  </button>

                </div>

              </div>

              <div>

                <label>Confirm Password</label>

                <div className="relative mt-2">

                  <Lock
                    className="absolute left-4 top-4 text-slate-400"
                    size={18}
                  />

                  <input
                    type={showConfirmPassword ? "text":"password"}
                    value={confirmPassword}
                    onChange={(e)=>setConfirmPassword(e.target.value)}
                    className="w-full h-12 rounded-xl bg-[#101E31] border border-slate-700 pl-12 pr-12"
                  />

                  <button
                    type="button"
                    onClick={()=>setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-3"
                  >
                    {showConfirmPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                  </button>

                </div>

              </div>

              <div>

                <label>
                  Referral Code
                  <span className="text-slate-500 text-sm ml-2">
                    (Optional)
                  </span>
                </label>

                <input
                  value={referralCode}
                  onChange={(e)=>setReferralCode(e.target.value)}
                  placeholder="Referral Code"
                  className="w-full mt-2 h-12 rounded-xl bg-[#101E31] border border-slate-700 px-4"
                />

              </div>

              {error && (
                <div className="rounded-xl bg-red-500/10 border border-red-500 text-red-300 text-sm p-3">
                  {error}
                </div>
              )}

              <button
                disabled={loading}
                onClick={handleRegister}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 font-semibold disabled:opacity-50"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>

            </div>

            <div className="text-center mt-8 text-slate-400">

              Already have an account?

              <Link
                to="/login"
                className="ml-2 text-sky-400"
              >
                Log In
              </Link>

            </div>

          </>
        )}

      </div>

    </div>
  );
}
