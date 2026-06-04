import React, { useEffect, useState } from 'react';

let toastTimeout;
let setToastGlobal;

export function showToast(msg) {
  if (!setToastGlobal) return;
  clearTimeout(toastTimeout);
  setToastGlobal('');
  setTimeout(() => {
    setToastGlobal(msg);
    toastTimeout = setTimeout(() => setToastGlobal(''), 2000);
  }, 0);
}

export default function Toast() {
  const [msg, setMsg] = useState('');

  useEffect(() => {
    setToastGlobal = setMsg;
  }, []);

  if (!msg) return null;
  return <div className="toast">{msg}</div>;
}