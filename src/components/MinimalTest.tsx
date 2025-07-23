const MinimalTest = () => {
  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      left: '10px',
      background: 'red',
      color: 'white',
      padding: '10px',
      zIndex: 9999,
      fontSize: '14px'
    }}>
      APP IS LOADING - {new Date().toLocaleTimeString()}
    </div>
  )
}

export default MinimalTest 