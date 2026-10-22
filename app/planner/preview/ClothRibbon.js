export default function ClothRibbon({className}){
  return <svg className={className} viewBox="0 0 80 760" preserveAspectRatio="none" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id="ribbon-satin" x1="0" x2="1"><stop offset="0" stopColor="#3f4e2b"/><stop offset=".19" stopColor="#78895a"/><stop offset=".42" stopColor="#bec69a"/><stop offset=".61" stopColor="#899b67"/><stop offset=".84" stopColor="#52663a"/><stop offset="1" stopColor="#354825"/></linearGradient>
      <linearGradient id="ribbon-shade" x1="0" y1="0" x2=".18" y2="1"><stop stopColor="#1d2514"/><stop offset=".07" stopColor="#1d2514" stopOpacity="0"/><stop offset=".23" stopColor="#eff1c7" stopOpacity=".16"/><stop offset=".29" stopColor="#253416" stopOpacity=".26"/><stop offset=".36" stopColor="#ffffff" stopOpacity="0"/><stop offset=".64" stopColor="#18250c" stopOpacity=".24"/><stop offset=".7" stopColor="#f7f6d5" stopOpacity=".26"/><stop offset=".78" stopColor="#ffffff" stopOpacity="0"/><stop offset="1" stopColor="#263919" stopOpacity=".1"/></linearGradient>
      <pattern id="ribbon-weave" width="3" height="4" patternUnits="userSpaceOnUse"><path d="M0 0V4M0 2H3" fill="none" stroke="#e1e7bc" strokeWidth=".35" opacity=".22"/></pattern>
      <path id="ribbon-shape" d="M29 7 C29 35 25 65 29 99 C42 175 23 239 29 321 C33 401 51 464 43 530 C33 597 39 673 47 748 L38 739 L29 753 C20 675 19 602 26 530 C34 459 14 401 13 322 C11 242 29 177 18 101 C13 64 17 33 20 7Z"/>
      <filter id="ribbon-drop" x="-50%" y="-10%" width="220%" height="130%"><feDropShadow dx="3" dy="2" stdDeviation="2.1" floodColor="#352910" floodOpacity=".35"/></filter>
    </defs>
    <use href="#ribbon-shape" fill="url(#ribbon-satin)" filter="url(#ribbon-drop)"/>
    <use href="#ribbon-shape" fill="url(#ribbon-shade)"/>
    <use href="#ribbon-shape" fill="url(#ribbon-weave)"/>
    <path d="M21 18 C18 69 21 83 25 105 C36 176 18 242 22 321 C25 400 45 463 37 530 C29 603 29 671 37 736" fill="none" stroke="#e0e5bb" strokeWidth=".7" opacity=".4"/>
    <ellipse cx="24" cy="6" rx="13" ry="5" fill="#3e2d1f" opacity=".7"/>
    <path d="M11 6 Q24 -1 37 6" fill="none" stroke="#b7a17b" strokeWidth="2.5"/>
  </svg>;
}
