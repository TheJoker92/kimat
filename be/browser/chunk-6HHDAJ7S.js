var o=Object.create;var g=Object.defineProperty,p=Object.defineProperties,q=Object.getOwnPropertyDescriptor,r=Object.getOwnPropertyDescriptors,s=Object.getOwnPropertyNames,j=Object.getOwnPropertySymbols,t=Object.getPrototypeOf,l=Object.prototype.hasOwnProperty,u=Object.prototype.propertyIsEnumerable;var k=(b,a,c)=>a in b?g(b,a,{enumerable:!0,configurable:!0,writable:!0,value:c}):b[a]=c,w=(b,a)=>{for(var c in a||={})l.call(a,c)&&k(b,c,a[c]);if(j)for(var c of j(a))u.call(a,c)&&k(b,c,a[c]);return b},x=(b,a)=>p(b,r(a));var y=(b,a)=>()=>(a||b((a={exports:{}}).exports,a),a.exports),z=(b,a)=>{for(var c in a)g(b,c,{get:a[c],enumerable:!0})},v=(b,a,c,f)=>{if(a&&typeof a=="object"||typeof a=="function")for(let d of s(a))!l.call(b,d)&&d!==c&&g(b,d,{get:()=>a[d],enumerable:!(f=q(a,d))||f.enumerable});return b};var A=(b,a,c)=>(c=b!=null?o(t(b)):{},v(a||!b||!b.__esModule?g(c,"default",{value:b,enumerable:!0}):c,b));var B=(b,a,c)=>new Promise((f,d)=>{var m=e=>{try{h(c.next(e))}catch(i){d(i)}},n=e=>{try{h(c.throw(e))}catch(i){d(i)}},h=e=>e.done?f(e.value):Promise.resolve(e.value).then(m,n);h((c=c.apply(b,a)).next())});export{w as a,x as b,y as c,z as d,A as e,B as f};
