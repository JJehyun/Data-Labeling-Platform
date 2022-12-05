// myPageContainer
export const myPageContainer = {
  position: "relative",
  display: "flex",
  flexDirection: "row",
  width: "100%",
  maxWidth: "1360px",
  minHeight: "100%",
  padding: "40px 80px",
  margin: "0px auto",
  boxSizing: "border-box",
};

// myPageContainer > dl, ul, ol, li, em

// myPageContainer > div p
export const myPageContainer_explanation = {
  padding: "0px 4px 24px",
  color: "rgb(117, 127, 136)",
  fontSize: "13px",
  lineHeight: "20px",
  margin: "0px",
};

// myPageContainer ul
export const myPageContainer_list = {
  listStyle: "none",
  paddingLeft: "0px",
};

// myPageContainer p > em
export const myPageContainer_emphasis = {
  listStyle: "none",
  color: "rgb(46, 125, 255)",
  fontWeight: "bold",
  fontStyle: "normal",
};

// myPageContainer input:disabled, myPageContainer select:disabled, myPageContainer textarea:disabled, myPageContainer button:disabled

// myPageContainer > aside
export const myPageContainer_aside = {
  width: "180px",
  minHeight: "100%",
  marginRight: "32px",
};

// myPageContainer > article
export const myPageContainer_article = {
  flex: "1 1 0%",
};

// myPageContainer .top h1
export const myPageContainer_top__h1 = {
  fontSize: "21px",
  lineHeight: "28px",
  fontWeight: "700",
  color: "rgb(32, 45, 57)",
  marginBottom: "16px",
};

// myPageContainer .top h2
export const myPageContainer_top__h2 = {
  fontSize: "21px",
  lineHeight: "28px",
  fontWeight: "700",
  color: "rgb(32, 45, 57)",
  marginTop: "32px",
};

// myPageContainer .top > h2 > span
export const myPageContainer_top__h2_emphasis = {
  marginLeft: "8px",
  color: "rgb(46 ,125, 255)",
  fontSize: "21px",
  lineHeight: "28px",
  fontWeight: "700",
};

// myPageContainer .top .tab
export const myPageContainer_top_tab = {
    position: "relative",
    display: "flex",
    WebkitBoxAlign: "center",
    alignItems: "center",
    boxShadow: "rgb(0, 0, 0 / 6%) 0px 1px 0px",
    borderBottom:" 1px solid rgb(235, 236, 238)",
    padding: "0px",
    listStyle: "none",
};

// myPageContainer .top .tab > li
export const tab_list = {
    position: "relative",
    display: "flex",
    fontSize: "17px",
    lineHeight: "24px",
    padding: "12px 2px 14px",
    color: "rgb(117, 127, 136)",
    WebkitBoxAlign: "center",
    alignItems: "center",
    WebkitBoxPack: "center",
    justifyContent: "center",
    fontWeight: "700",
    textAlign: "center",
    marginRight: "16px",
    boxSizing: "border-box",
    cursor: "pointer",
    wordBreak: "break-word",
}

// myPageContainer .top .tab > li:hover
export const tab_list__hover = {
    color: "rgb(32, 45, 57)",
    position: "relative",
    display: "flex",
    fontSize: "17px",
    lineHeight: "24px",
    padding: "12px 2px 14px",
    WebkitBoxAlign: "center",
    alignItems: "center",
    WebkitBoxPack: "center",
    justifyContent: "center",
    fontWeight: "700",
    textAlign: "center",
    marginRight: "16px",
    boxSizing: "border-box",
    cursor: "pointer",
    wordBreak: "break-word",
}

// myPageContainer .top .tab > li.active
export const tab_list__active = {
    color: "rgb(32, 45, 57)",
    borderBottom: "3px solid rgb(32, 45, 57)",
    position: "relative",
    display: "flex",
    fontSize: "17px",
    lineHeight: "24px",
    padding: "12px 2px 14px",
    WebkitBoxAlign: "center",
    alignItems: "center",
    WebkitBoxPack: "center",
    justifyContent: "center",
    fontWeight: "700",
    textAlign: "center",
    marginRight: "16px",
    boxSizing: "border-box",
    cursor: "pointer",
    wordBreak: "break-word",
}

// myPageContainer .top .tab > li:last-of-type
export const tab_list__last = {
  position: "relative",
    display: "flex",
    fontSize: "17px",
    lineHeight: "24px",
    padding: "12px 2px 14px",
    color: "rgb(117, 127, 136)",
    WebkitBoxAlign: "center",
    alignItems: "center",
    WebkitBoxPack: "center",
    justifyContent: "center",
    fontWeight: "700",
    textAlign: "center",
    marginRight: "16px",
    boxSizing: "border-box",
    cursor: "pointer",
    wordBreak: "break-word",
    margin: "0px",
}

// myPageContainer .bottom, myPageContainer .profileBottom, myPageContainer .pswdBottom
export const myPageContainer_bottom = {
    position: "relative",
    paddingTop: "44px",
}

// myPageContainer .bottom .formSection
export const myPageContainer_bottom_form = {
    midWidth: "600px",
}

// myPageContainer .fixedBottom
export const myPageContainer_bottom_fixedBottom = {
    position: "fixed",
    bottom: "0px",
    maxWidth: "988px",
    width: "calc((100% - 212px) - 160px)",
    padding: "12px 0px",
    background: "rgb(255, 255, 255)",
    borderTop: "1px solid rgb(196, 200, 204)",
    zIndex: "1",
}

// myPageContainer .fixedBottom > div
export const fixedBottom_div = {
    display: "flex",
    WebkitBoxPack: "end",
    justifyContent: "flex-end",
}

// myPageContainer .fixedBottom .button
export const fixedBottom_button = {
    position: "relative",
    display: "inline-block",
    padding: "4px",
    boxSizing: "border-box",
}

// myPageContainer .fixedBottom .button > button
export const fixedBottom_button_button = {
    width: "100%",
    padding: "12px 24px",
    color: "rgb(255, 255, 255)",
    borderRadius: "8px",
    border: "1px solid rgb(46, 125, 255)",
    backgroundColor: "rgb(46, 125, 255)",
    fontSize: "15px",
    fontWeight: "700",
    minHeight: "48px",
    textAlign: "center",
    verticalAlign: "middle",
    cursor: "pointer",
}

// userProfile .fixedBottom .button > button:disabled
export const fixedBottom_button_button__disabled = {
    color: "rgb(156, 163, 170)",
    backgroundColor: "rgb(235, 236, 238)",
    border: "1px solid rgb(223, 225, 230)",
    cursor: "default",
}

// myPageContainer .fixedBottom div > div.button:last-of-type
export const fixedBottom_button__last = {
    padding: "4px 0px 4px 4px",
    position: "relative",
    display: "inline-block",
    boxSizing: "border-box",
}

// myPageContainer .fixedBottom div > div.button:first-of-type
export const fixedBottom_button_button__first = {
    paddingLeft: "0px",
}

// myPageNav .navMenu > li > dl > dt:hover, myPageNav .navMenu > li > dl > dd:hover