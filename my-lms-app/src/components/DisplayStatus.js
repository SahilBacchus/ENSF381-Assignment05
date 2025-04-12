function DisplayStatus({type, msg}) {
    return (
        <div className="DisplayStatus">
            {type === 'success' ? <p style={{color:"green", textAlign:"center"}}>{msg}</p> : <p style={{color:"indianred", textAlign:"center"}}>{msg}</p>}
        </div>
    );
  }
  
  export default DisplayStatus;