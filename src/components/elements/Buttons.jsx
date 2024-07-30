
export const SubmitButton = (props) => {
  return (
    <button 
      onClick={props.onClick}  
      className={ props.className } 
      type="submit" 
      style={props.style}
    >{ props.title }</button>
  )
}

export const DisabledButton = (props) => {
  return (
    <button 
    className={ props.className }
      style={{
        filter: "opacity(0.5)",
        color: "#fff",
        fontSize: "15px", pointerEvents: 
        "none",
        ...props.style
      }}>{props.title}
    </button>
  )
}

export const LoadingButton = () => {
  return (
    <button className="btn btn-brand-1 hover-up w-100"> <i className="fa fa-spinner fa-spin"></i> &nbsp; &nbsp; Submitting...</button>
)
}

export const SuspendUserButton = (props) => {
  return (
    <a className={props.class} onClick={props.onClick} style={{padding: '6px 9px'}}>{ props.title }</a>
)
}

