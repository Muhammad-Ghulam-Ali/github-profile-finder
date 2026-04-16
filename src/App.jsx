import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {

  const [userData, setUserData] = useState(null);
  const [repoData, setRepoData] = useState([]);
  const [searchTxt, setSearchTxt] = useState("");
  const userName = searchTxt.trim().replace(/\s+/g, "-");
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState("")

  const getData = async () => {
    if (!searchTxt) return;
    setLoader(true)
    setUserData(null)
    setRepoData([])
    setError("")

    const userResponse = await fetch(`https://api.github.com/users/${userName}`);
    const repoResponse = await fetch(`https://api.github.com/users/${userName}/repos?sort=updated&per_page=5`);

    if (!userResponse.ok || !repoResponse.ok) {
      setError("User not found.")
      setLoader(false)
      return;
    }

    const userResult = await userResponse.json();
    const repoResult = await repoResponse.json();

    setUserData(userResult);
    setRepoData(repoResult);
    setLoader(false);
  }

  console.log(userData);
  console.log(repoData);



  return (
    <>
      <div className="flex flex-col gap-4 px-4 pt-6 md:px-16 md:py-8">

        {/* Header */}
        <div className="header flex flex-col gap-3">
          <h1 className='font-bold text-3xl md:text-6xl text-[#E8E4D9]'>GitHub</h1>
          <h1 className='text-3xl md:text-6xl italic text-[#BA7517]'>Profile Finder</h1>
          <p className='text-[#888780]'>Search any GitHub user and fetch their public profile in real time.</p>
        </div>

        {/* Searchbar */}
        <div className="searchBar flex flex-row items-center justify-between border border-[#BA7517] rounded-2xl w-full">
          <input
            value={searchTxt}
            onChange={(e) => setSearchTxt(e.target.value)}
            className='w-[78%] md:w-[80%] lg:w-[90%] px-3 py-2 md:px-6 md:py-2 rounded-2xl text-[#E8E4D9]' type="text" placeholder='Search name...' />
          <button
            onClick={() => getData()}
            className='w-[22%] md:w-[20%] lg:w-[10%] px-3 py-2 md:px-6 md:py-2 bg-[#3A3930] border border-[#68685a] rounded-2xl text-[#E8E4D9] cursor-pointer font-bold hover:bg-[#515043]'>Search</button>
        </div>

        {/* LOADING */}
        <div className="flex items-center justify-center">
          <div className={`flex items-center justify-center mt-[10%] w-[70%] py-6 rounded-2xl border border-[#68685a] bg-[#3A3930] ${loader ? "block" : "hidden"}`}>
            <h1 className={`text-white`}><span className='inline-block w-3 h-3 rounded-full bg-green-600 mr-1 blink'></span> Fetching profile for <span className='font-bold'>{userName}...</span></h1>
          </div>
        </div>

        {/* NO USER */}
        <div className="flex items-center justify-center">
          <div className={`flex flex-col items-center justify-start mt-[10%] w-[70%] py-6 rounded-2xl border border-red-400 bg-[#3A3930] ${error ? "block" : "hidden"}`}>
            <h1 className={`text-red-300`}><span className='inline-block w-3 h-3 rounded-full bg-red-600 mr-2'></span>{error}</h1>
            <small className='text-[#E8E4D9]'>No GitHub account matches <span className='font-bold'>"{userName}"</span>. Check the spelling and try again.</small>
          </div>
        </div>


        {/* Cards */}
        <div className={`${!userData ? "hidden" : "block"}`}>
          {/* This div would be used for hiding the info before search */}
          <div className="flex justify-center">
            <div className="card flex flex-col gap-4 w-full max-w-[700px] bg-[#3A3930] mt-6 rounded-2xl">
              <div className="info flex flex-col md:flex-row items-center gap-8 w-full bg-[#F5EDD8] py-8 px-6 rounded-t-2xl">
                <div className="logo">
                  <h1 className='py-6 px-6.5 rounded-[50%] font-bold text-[#E8E4D9] text-xl bg-[#BA7517]'>
                    {(userData?.name || userData?.login)
                      ?.trim()
                      .split(/\s+/)
                      .map(word => word[0])
                      .join("")
                      .toUpperCase()}
                  </h1>
                </div>
                <div className="nameBio flex flex-col">
                  <h1 className='font-bold text-2xl'>
                    {userData?.login
                      ?.replace(/-/g, " ")
                      .toUpperCase()}
                  </h1>
                  <a className='text-[#BA7517]' href={`${userData?.html_url}`} target="_blank" >Visit profile <i class="fa-solid fa-arrow-up-right-from-square"></i></a>
                  <p className='mt-4 text-[#633806]'>{userData?.bio ? userData?.bio : "User has no bio."}</p>
                </div>
              </div>
              <div className="followerDetail w-full py-4 px-5 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="followers flex flex-col items-center justify-center gap-3  py-2 bg-[#2C2B25] rounded-xl ">
                  <h1 className='font-bold text-2xl text-[#E8E4D9]'>{userData?.followers}</h1>
                  <h1 className='text-[#a4a19a]'>Followers</h1>
                </div>
                <div className="following flex flex-col items-center justify-center gap-3  py-2 bg-[#2C2B25] rounded-xl">
                  <h1 className='font-bold text-2xl text-[#E8E4D9]'>{userData?.following}</h1>
                  <h1 className='text-[#a4a19a]'>Following</h1>
                </div>

                <div className="repos flex flex-col items-center justify-center gap-3  py-2 bg-[#2C2B25] rounded-xl">
                  <h1 className='font-bold text-2xl text-[#E8E4D9]'>{userData?.public_repos}</h1>
                  <h1 className='text-[#a4a19a]'>Public Repos</h1>
                </div>
              </div>
            </div>
          </div>

          {/* Latest five repos */}
          <div className={`flex flex-col items-center justify-center mt-8 ${userData?.public_repos < 1 ? "hidden" : "block"}`}>
            <small className='text-[#888780]'>LATEST REPOSITORIES</small>
            <div className="reposDetail w-full ">

              <div className="repoCards mt-6 flex flex-col items-center justify-center gap-4">
                {repoData.map(function (elem) {
                  return (
                    <div
                      key={elem.id}
                      className="repoCard w-[100%] md:w-[80%] flex flex-col gap-3 px-7 py-6 rounded-2xl bg-[#3A3930]">
                      <div className="repoTitle flex items-center justify-between">
                      <h1 className='font-bold text-2xl text-[#BA7517]'>{elem?.name}</h1>
                      <a className='text-[#BA7517]' href={`${elem?.html_url}`} target='_blank'>View <i class="fa-solid fa-arrow-up-right-from-square"></i></a>
                      </div>
                      <p className='text-[#888780]'>{elem?.description ? elem?.description : "No description for the repo."}</p>
                    </div>
                  )
                })}

              </div>
            </div>
          </div>

        </div>



      </div>
    </>
  )
}

export default App

