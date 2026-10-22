export function initializeApp(cfg){ const a={name:'[DEFAULT]',options:cfg}; (globalThis.__apps ||= []).push(a); return a; }
export function getApps(){ return globalThis.__apps || []; }
export function getApp(){ return (globalThis.__apps||[])[0]; }
