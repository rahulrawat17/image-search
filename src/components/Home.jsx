import React, { useEffect, useState, useRef, useCallback } from 'react'
import './Home.css'
import ExtendedImgView from './ExtendedImgView'
import useGetPhotos from '../hooks/useGetPhotos'

const Home = () => {
    const [photos, set_photos] = useState([])
    const [searchInpText, set_searchInpText] = useState('')
    const [searchHistory, set_searchHistory] = useState([])
    const [selectedImgUrl, set_selectedImgUrl] = useState('')
    const [isPopImg, set_isPopImg] = useState(false)

    const [pageNo, set_pageNo] = useState(1)
    const {allPhotos, loading} = useGetPhotos("getRecent", pageNo, searchInpText)

    const observer = useRef()
    const lastBookElementRef = useCallback(node => {
      if (loading) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            set_pageNo(prevPageNumber => prevPageNumber + 1)
        }
      })
      if (node) observer.current.observe(node)
    }, [loading])
    
    // links
    const url = "https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&format=json&nojsoncallback=1&api_key=19a839a57da26ce4321f69b18e1b7e15&per_page=20&page=1";
    const search_url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&format=json&nojsoncallback=1&api_key=19a839a57da26ce4321f69b18e1b7e15&per_page=20&page=1&text=";

    // to get image source url for image tag
    const getImgSourceUrl = (farm, server, id, secret) => {
        return `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}.jpg`;
    }

    // search button onclick
    const searchOnClick = () => {
        set_searchHistory(prev => [...prev, searchInpText])
    }

    // clear search history and search input
    const clearHistoryOnClick = () => {
        set_searchInpText('')
        set_searchHistory([])
        localStorage.setItem("searchHistory", [])
    }

    // selected image onclick (to view selected image)
    const onImageClick = (url) => {
        set_isPopImg(true)
        set_selectedImgUrl(url)
    }

    useEffect(() => {
        const searchHistory = localStorage.getItem('searchHistory');
        if (searchHistory) {
            set_searchHistory(prev => [...prev, searchHistory]);
        }
    }, [])

    useEffect(() => {
        localStorage.setItem("searchHistory", searchHistory)
    }, [searchHistory])


    // useEffect(() => {
    //     // get photos as per the searched text
    //     if (searchInpText.length > 0) {
    //         fetch(search_url + searchInpText).then(res => res.json()).then(data => {
    //             set_photos(data.photos.photo);
    //         })
    //     }
    //     // get the recent photos if no search input is there
    //     else {
    //         fetch(url).then(res => res.json()).then(data => {
    //             set_photos(data.photos.photo);
    //         })
    //     }
    // }, [searchInpText])

    // handle image onClick by closing the selected image
    const closeImgHandleClick = () => {
        set_isPopImg(false)
    };

    return (
        <>
            <div className='search-section'>
                <input value={searchInpText} onChange={e => set_searchInpText(e.target.value)} type="text" />
                <button onClick={() => searchOnClick()}>Go</button>
                <button onClick={() => clearHistoryOnClick()}>Clear History</button>
                <br />
                <h5 style={{ marginBottom: "5px" }}>Recent Searches</h5>
                {searchHistory.length > 0 ?
                    <div style={{ marginTop: "5px" }}>
                        <div className="search-parent">
                            {searchHistory.map((item, i) =>
                                <div key={i} className="search-item">
                                    {item}
                                </div>
                            )}
                        </div>
                    </div> : 'no search history'}
            </div>
            {isPopImg ?
                <ExtendedImgView src={selectedImgUrl} closeImg={closeImgHandleClick} /> : ''
            }
            <div className="gallery-parent">
                {allPhotos ? allPhotos.map(item => (
                    <div ref={lastBookElementRef} className='gallery-child'>
                        <img
                            src={getImgSourceUrl(item.farm, item.server, item.id, item.secret)}
                            alt=""
                            style={{ marginTop: "140px" }}
                            onClick={() => onImageClick(getImgSourceUrl(item.farm, item.server, item.id, item.secret))}
                        />
                    </div>
                )) : ''}
            </div>
        </>
    )
}

export default Home