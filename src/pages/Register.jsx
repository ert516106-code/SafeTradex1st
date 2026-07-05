import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
Mail,
Lock,
Eye,
EyeOff
} from "lucide-react";

export default function Register() {

const [step,setStep]=useState(1);

const [country,setCountry]=useState("");
const [accepted,setAccepted]=useState(false);

const [email,setEmail]=useState("");
const [password,setPassword]=useState("");
const [confirmPassword,setConfirmPassword]=useState("");

const [showPassword,setShowPassword]=useState(false);
const [showConfirmPassword,setShowConfirmPassword]=useState(false);

return(

<div className="min-h-screen bg-white flex justify-center px-5 py-10">

<div className="w-full max-w-md">

{step===1 && (

<>

<h1 className="text-4xl font-bold text-center">
Where do you live?
</h1>

<p className="text-center text-gray-500 mt-3 mb-10">
Your response will be used to set up your account and verify your identity.
</p>

<div className="border rounded-3xl p-8 shadow-sm">

<label className="font-semibold">
Country / Region
</label>

<select
className="w-full mt-3 border rounded-xl h-12 px-4"
value={country}
onChange={(e)=>setCountry(e.target.value)}
>

<option value="">
Select Country
</option>

<option>United States</option>
<option>Canada</option>
<option>Philippines</option>
<option>United Kingdom</option>
<option>Australia</option>

</select>

<div className="flex mt-6 items-start gap-3">

<input
type="checkbox"
checked={accepted}
onChange={()=>setAccepted(!accepted)}
/>

<p className="text-sm text-gray-500">
By creating an account I agree to the Terms and Privacy Policy
</p>

</div>

<button
onClick={()=>setStep(2)}
disabled={!country || !accepted}
className="w-full h-12 mt-8 rounded-xl bg-blue-600 text-white disabled:bg-gray-300"
>

Create account

</button>

</div>

<div className="text-center mt-8">
Already have an account?{" "}
<Link
to="/login"
className="text-blue-600"
>
Log in
</Link>
</div>

</>

)}

{step===2 && (

<>

<h1 className="text-4xl font-bold text-center">
Create Account
</h1>

<p className="text-center text-gray-500 mt-3 mb-10">
Sign up to get started
</p>

<div className="border rounded-3xl p-8 shadow-sm">

<button
className="w-full h-12 border rounded-xl font-medium"
>

Continue with Google

</button>

<div className="flex items-center my-6">

<div className="flex-1 border-t"/>

<span className="px-3 text-gray-500">
OR
</span>

<div className="flex-1 border-t"/>

</div>

<div>

<label>Email</label>

<div className="relative mt-2">

<Mail className="absolute left-3 top-4 w-4"/>

<input
className="w-full border h-12 rounded-xl pl-10"
placeholder="you@example.com"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

</div>

</div>

<div className="mt-5">

<label>Password</label>

<div className="relative mt-2">

<Lock className="absolute left-3 top-4 w-4"/>

<input
type={showPassword ? "text":"password"}
className="w-full border h-12 rounded-xl pl-10 pr-10"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>

<button
type="button"
className="absolute right-3 top-4"
onClick={()=>setShowPassword(!showPassword)}
>

{showPassword ?
<EyeOff size={18}/>
:
<Eye size={18}/>
}

</button>

</div>

</div>

<div className="mt-5">

<label>Confirm Password</label>

<div className="relative mt-2">

<Lock className="absolute left-3 top-4 w-4"/>

<input
type={showConfirmPassword ? "text":"password"}
className="w-full border h-12 rounded-xl pl-10 pr-10"
value={confirmPassword}
onChange={(e)=>setConfirmPassword(e.target.value)}
/>

<button
type="button"
className="absolute right-3 top-4"
onClick={()=>setShowConfirmPassword(!showConfirmPassword)}
>

{showConfirmPassword ?
<EyeOff size={18}/>
:
<Eye size={18}/>
}

</button>

</div>

</div>

<button
className="w-full h-12 mt-8 rounded-xl bg-blue-600 text-white"
>

Create Account

</button>

</div>

<div className="text-center mt-8">

Already have an account?{" "}

<Link
to="/login"
className="text-blue-600"
>
Log in
</Link>

</div>

</>

)}

</div>

</div>

);

}
