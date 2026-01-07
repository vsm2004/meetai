interface Props {
  meetingId: string;
  meetingName: string;
}
import React from 'react'
import { useState } from 'react';
import { StreamTheme,useCall } from '@stream-io/video-react-sdk';
import { CallLobby } from './call-lobby';
import { CallActive } from './call-active';
import { CallEnded } from './call-ended';

const CallUi = ({meetingName}:Props) => {
  const call=useCall();
  const[show,setShow]=useState<"lobby"|"call"|"ended">("lobby");
  const handlejoin=async()=>{
    if(!call) return;
    await call.join();
    setShow("call");
  };
  const handleLeave=()=>{
    if(!call) return;
    call.endCall();
    setShow("ended")
  }
  return(
    <StreamTheme className="h-full">
      {show==="lobby" && <CallLobby onJoin={handlejoin}/>}
      {show==="call" && <CallActive onLeave={handleLeave} meetingName={meetingName}/>}
      {show==="ended" && <CallEnded/>}
    </StreamTheme>
  )
}

export default CallUi
