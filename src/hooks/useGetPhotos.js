import React, { useEffect, useState } from 'react'

export default function useGetPhotos(method, pageNo, searchText = "") {
    const [allPhotos, set_allPhotos] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (searchText === '') {
            setLoading(true)
            let url;
            if (method === 'getRecent') {
                url = "https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&format=json&nojsoncallback=1&api_key=19a839a57da26ce4321f69b18e1b7e15&per_page=20&page=" + pageNo;
            }
            else {
                url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&format=json&nojsoncallback=1&api_key=19a839a57da26ce4321f69b18e1b7e15&per_page=20&page=" + pageNo + "&text=" + searchText;
            }
            fetch(url).then(res => res.json()).then(data => {
                setLoading(false)
                set_allPhotos(prevPhotos => {
                    return [...prevPhotos, ...data.photos.photo]
                });
            }).catch(error => {
                return []
            })
        }
        else {
            setLoading(true)
            let url;
            url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&format=json&nojsoncallback=1&api_key=19a839a57da26ce4321f69b18e1b7e15&per_page=20&page=" + pageNo + "&text=" + searchText;
            fetch(url).then(res => res.json()).then(data => {
                setLoading(false)
                set_allPhotos(prevPhotos => {
                    return [...prevPhotos, ...data.photos.photo]
                });
            }).catch(error => {
                return []
            })
        }
    }, [pageNo])
    
    useEffect(() => {
        if (searchText.length > 0) {
            setLoading(true)
            let url;
            url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&format=json&nojsoncallback=1&api_key=19a839a57da26ce4321f69b18e1b7e15&per_page=20&page=" + pageNo + "&text=" + searchText;
            fetch(url).then(res => res.json()).then(data => {
                setLoading(false)
                set_allPhotos(prevPhotos => {
                    return [...data.photos.photo]
                });
            }).catch(error => {
                return []
            })
        }
        else {
            let url;
            url = "https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&format=json&nojsoncallback=1&api_key=19a839a57da26ce4321f69b18e1b7e15&per_page=20&page=" + pageNo;
            setLoading(true)
            fetch(url).then(res => res.json()).then(data => {
                setLoading(false)
                set_allPhotos(prevPhotos => {
                    return [...data.photos.photo]
                });
            }).catch(error => {
                return []
            })
        }
    }, [method, searchText])

    return { allPhotos, loading }
}
