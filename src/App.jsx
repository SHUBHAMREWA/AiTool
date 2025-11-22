

import './App.css'
import { useEffect, useState , useRef, useCallback } from 'react'
import { URL } from './constants'
import Recentsearch from './Componets/Recentsearch';
import QuestionAns from './Componets/QuestionAns';



function App() {

  const [question, setQuestion] = useState("");
  const [result, setResult] = useState([]);
  const [recentHistory, setHistory] = useState(JSON.parse(localStorage.getItem("history")));
  const [selectedHistory, setSelectedHistory] = useState(""); 
  const scrollEl                             =  useRef()  ;
  const [loader , setLoader]                 =   useState(false);  


  // Dark Mode 
  const [darkMode , setDarkMode]             = useState("dark")
  // Mobile sidebar toggle
  const [showSidebar, setShowSidebar]        = useState(false)

  useEffect(()=>{

        if(darkMode == "dark"){
             document.documentElement.classList.add("dark")
        }
        else{
          document.documentElement.classList.remove("dark")
        }

  }, [darkMode])

 const  changeDarkMode =(e)=>{
       let value = e.target.value
      setDarkMode(value)
 }

  useEffect(() => {

    setQuestion("")
    if (selectedHistory) {
      askQuestion()
      setSelectedHistory("")
      setShowSidebar(false)
    }


  }, [selectedHistory])

useCallback(()=>{
    result
} , [result])


  const askQuestion = async () => {

      setLoader(true) 

    if (question) {

      if (localStorage.getItem("history")) {
        let history = JSON.parse(localStorage.getItem("history"));
        history = [question, ...history];
        localStorage.setItem("history", JSON.stringify(history));
        setHistory(history)
      }
      else {
        localStorage.setItem("history", JSON.stringify([question]));
        setHistory([question]) ;
      }

    }



    const payLoadData = question ? question : selectedHistory

    const payLoad = {
      "contents": [{
        "parts": [{ "text": payLoadData }]
      }]
    }

    let response = await fetch(URL, {
      method: "POST",
      body: JSON.stringify(payLoad)
    });


    response = await response.json();

    response ? setQuestion("") : null

    let dataString = response.candidates[0].content.parts[0].text;

    dataString = dataString.split("* ");

    dataString = dataString.map((el) => {
      return el.trim()
    })

    setResult([...result, { type: 'q', text: question ? question : selectedHistory }, { type: 'a', text: dataString }])
    setQuestion("")


     setTimeout(()=>{
       setLoader(false) ;
      scrollEl.current.scrollTop = scrollEl.current.scrollHeight  ; 
     } , 500)
  }

 


  const isEnter = (e) => {
    if (e.key == "Enter" && e.target.value != "") {
      askQuestion()
    } else
      if (e.key == "Enter" && e.target.value == "") {
        alert("please Type you Question")
      }

  }

  return (

    <> 
      <div className={darkMode=="dark" ? darkMode : "light" }>
      {/*Main Container*/}
      <div className='grid grid-cols-1 md:grid-cols-5'>

      <select 
      onChange={changeDarkMode}
      className="fixed bottom-2 right-2 z-50 p-3 dark:bg-black bg-violet-500 dark:text-white text-purple ">
      <option value="dark" >Dark</option>
      <option value="light" >Light</option>
    </select>


        {/* Left Elements ,, Recent History Box (hidden on mobile) */}
       <div className='hidden md:block'>
         <Recentsearch 
           recentHistory={recentHistory} 
           setSelectedHistory = {setSelectedHistory} 
           setHistory={setHistory}/>
       </div>


        {/* Right Elements */}
        <div className='md:col-span-4 col-span-1 text-center p-4 md:p-10 '>

          {/* Mobile top bar */}
          <div className='flex items-center justify-between md:hidden mb-3'>
            <h1
              className="text-2xl font-semibold"
              style={{
                background: "linear-gradient(to left  , #3F5EFB , #FC466B)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Ask Me Anything
            </h1>
            <button onClick={()=>setShowSidebar(true)} className='px-3 py-2 rounded-md border border-zinc-600 dark:text-white text-black'>Recent</button>
          </div>

          {/* right heading (desktop) */}
          <h1
            className="hidden md:block text-4xl font-semibold mb-4"
            style={{
              background: "linear-gradient(to left  , #3F5EFB , #FC466B)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Hello Users Ask Me Anything
          </h1> 
          
        
          {/* right Answer Box */}
          <div  ref={scrollEl}
            className='container h-[60vh] md:h-[70vh] overflow-y-auto scrollbar-hide'>
            <ul className='list-none '>
             <QuestionAns result={result} />
            </ul>

             {/* spinner Loader */} 
        {    loader ? 
                <div role="status"  className='p-3'>
                  <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-purple-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                  </svg>
                  <span className="sr-only">Loading...</span>
              </div> : 
              null
        }

            <div >
            </div>
          </div>

          {/* Search input  */}
          <div className='dark:bg-zinc-800 bg-zinc-600 w-full md:w-1/2 text-white m-auto rounded-4xl border pr-5 border-zinc-600 
                          flex p-1 h-16 '>
            <input
              onKeyDown={isEnter}
              onChange={(e) => setQuestion(e.target.value)}
              value={question}
              type="text" className='w-full h-full outline-none p-3' placeholder='Ask Me Anything' />
            <button
              onClick={() => question !== "" ? askQuestion() : alert("please Type you Question")}
              className="cursor-pointer">Ask</button>
          </div>


        </div>
      </div>

      {/* Mobile sidebar drawer */}
      { showSidebar && (
        <div className='fixed inset-0 z-40 md:hidden'>
          <div className='absolute inset-0 bg-black/50' onClick={()=>setShowSidebar(false)} />
          <div className='absolute top-0 left-0 h-full w-3/4 max-w-xs shadow-lg'>
            <Recentsearch 
              recentHistory={recentHistory} 
              setSelectedHistory = {setSelectedHistory} 
              setHistory={setHistory}/>
          </div>
        </div>
      )}

      </div>
    </>
  )
}

export default App
