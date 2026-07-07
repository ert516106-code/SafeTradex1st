import { useNavigate } from "react-router-dom";

export default function Navbar(){

const navigate = useNavigate();

return(

<div className="navbar">

<h1>SafeTradex</h1>

<div
className="profile"
onClick={()=>navigate("/profile")}
>

👤

</div>

</div>

);

}
