import React from 'react'
import Chat from './Chat'
import Head from './Head'
import { Switch, Route, Link } from 'react-router-dom'
function App(){
 return(
  <div className="App">
   
    <Switch>
      <Route path='/'>
        <Head />
        <Chat />
      </Route>
    </Switch>
  </div>
 )
}
export default App;
