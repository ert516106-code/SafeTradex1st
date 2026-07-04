import { useState, useEffect } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '../lib/LanguageContext';

function ModalShell({ title, onClose, children }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 512,
          backgroundColor: '#fff',
          borderRadius: '24px 24px 0 0',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '85vh'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'center', padding:'12px 0 4px' }}>
          <div style={{
            width:40,
            height:4,
            borderRadius:999,
            background:'#d1d5db'
          }}/>
        </div>

        <div style={{
          display:'flex',
          justifyContent:'space-between',
          alignItems:'center',
          padding:'8px 20px 12px',
          borderBottom:'1px solid #f3f4f6'
        }}>
          <h2 style={{margin:0,fontSize:18,fontWeight:700}}>
            {title}
          </h2>

          <button
            onClick={onClose}
            style={{
              border:'none',
              background:'none',
              cursor:'pointer'
            }}
          >
            <X size={20}/>
          </button>
        </div>

        <div style={{overflowY:'auto',padding:'20px'}}>
          {children}
        </div>
      </div>
    </div>
  );
}

function PasswordInput({
  label,
  value,
  onChange
}) {

  const [show,setShow]=useState(false);

  return (
    <div style={{marginBottom:16}}>
      <p>{label}</p>

      <div style={{position:'relative'}}>
        <input
          type={show?'text':'password'}
          value={value}
          onChange={(e)=>onChange(e.target.value)}
          style={{
            width:'100%',
            height:48,
            border:'1px solid #e5e7eb',
            borderRadius:12,
            padding:'0 44px 0 16px'
          }}
        />

        <button
          onClick={()=>setShow(!show)}
          style={{
            position:'absolute',
            right:14,
            top:'50%',
            transform:'translateY(-50%)',
            border:'none',
            background:'none'
          }}
        >
          {show ? <EyeOff size={16}/> : <Eye size={16}/>}
        </button>
      </div>
    </div>
  )
}

function SubmitBtn({
  label,
  onClick,
  disabled
}){

return(
<button
onClick={onClick}
disabled={disabled}
style={{
width:'100%',
height:52,
borderRadius:14,
background:'#3b82f6',
color:'#fff',
border:'none',
fontWeight:700,
cursor:'pointer'
}}
>
{label}
</button>
)
}

export function FundPasswordModal({open,onClose}){

const[current,setCurrent]=useState('')
const[next,setNext]=useState('')
const[confirm,setConfirm]=useState('')

if(!open)return null

const handle=()=>{

if(next.length<6){
toast.error('Password must be at least 6 characters')
return
}

if(next!==confirm){
toast.error('Passwords do not match')
return
}

toast.success('Fund password updated')

setCurrent('')
setNext('')
setConfirm('')

onClose()

}

return(
<ModalShell
title="Set Fund Password"
onClose={onClose}
>

<PasswordInput
label="Current Password"
value={current}
onChange={setCurrent}
/>

<PasswordInput
label="New Password"
value={next}
onChange={setNext}
/>

<PasswordInput
label="Confirm Password"
value={confirm}
onChange={setConfirm}
/>

<SubmitBtn
label="Update"
onClick={handle}
/>

</ModalShell>
)

}

export function LoginPasswordModal({open,onClose}){

if(!open)return null

return(
<ModalShell
title="Login Password"
onClose={onClose}
>
<p>Coming soon</p>
</ModalShell>
)

}

const languages=[
'English',
'Chinese (简体)',
'Chinese (繁體)',
'Japanese',
'Korean',
'Spanish',
'French',
'German',
'Arabic',
'Russian',
'Portuguese',
'Vietnamese',
'Thai'
]

export function LanguageModal({
open,
onClose
}){

const{
language,
setLanguage
}=useLanguage()

if(!open)return null

return(
<ModalShell
title="Language"
onClose={onClose}
>

{languages.map((lang)=>(

<button
key={lang}
onClick={()=>{
setLanguage(lang)
toast.success(`Language set to ${lang}`)
onClose()
}}
>

{lang}
{language===lang && ' ✓'}

</button>

))}

</ModalShell>
)

}

export function NotificationsModal({open,onClose}){

if(!open)return null

return(
<ModalShell
title="Notifications"
onClose={onClose}
>
<p>Notifications settings</p>
</ModalShell>
)

}

export function SecurityModal({open,onClose}){

if(!open)return null

return(
<ModalShell
title="Security"
onClose={onClose}
>
<p>Security settings</p>
</ModalShell>
)

}

export function AccountBindingModal({open,onClose}){

if(!open)return null

return(
<ModalShell
title="Account Binding"
onClose={onClose}
>
<p>Account binding settings</p>
</ModalShell>
)

}

export {
FundPasswordModal,
LoginPasswordModal,
LanguageModal,
NotificationsModal,
SecurityModal,
AccountBindingModal
};
