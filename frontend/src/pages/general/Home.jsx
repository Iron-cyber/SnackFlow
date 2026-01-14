/**import React, { useEffect, useState } from 'react'
import axios from 'axios';
import '../../styles/reels.css'
import ReelFeed from '../../components/ReelFeed'

const Home = () => {
    const [ videos, setVideos ] = useState([])
    

    useEffect(() => {
        axios.get("http://localhost:3000/api/food", { withCredentials: true })
            .then(response => {

                console.log(response.data);

                setVideos(response.data.foodItems)
            })
            .catch(() => { })
    }, [])

    
    async function likeVideo(item) {

        const response = await axios.post("http://localhost:3000/api/food/like", { foodId: item._id }, {withCredentials: true})

        if(response.data.like){
            console.log("Video liked");
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, likeCount: v.likeCount + 1 } : v))
        }else{
            console.log("Video unliked");
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, likeCount: v.likeCount - 1 } : v))
        }
        
    }

    async function saveVideo(item) {
        const response = await axios.post("http://localhost:3000/api/food/save", { foodId: item._id }, { withCredentials: true })
        
        if(response.data.save){
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, savesCount: v.savesCount + 1 } : v))
        }else{
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, savesCount: v.savesCount - 1 } : v))
        }
    }

    return (
        <ReelFeed
            items={videos}
            onLike={likeVideo}
            onSave={saveVideo}
            emptyMessage="No videos available."
        />
    )
}

export default Home**/

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import '../../styles/reels.css'
import ReelFeed from '../../components/ReelFeed'
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const [videos, setVideos] = useState([])
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        axios.get("http://localhost:3000/api/food", { withCredentials: true })
            .then(response => {
                setIsAuthenticated(true)
                setVideos(response.data.foodItems)
            })
            .catch(() => {
                setIsAuthenticated(false)
            })
    }, [])

    async function likeVideo(item) {
        const response = await axios.post(
            "http://localhost:3000/api/food/like",
            { foodId: item._id },
            { withCredentials: true }
        )

        setVideos(prev =>
            prev.map(v =>
                v._id === item._id
                    ? { ...v, likeCount: v.likeCount + (response.data.like ? 1 : -1) }
                    : v
            )
        )
    }

    async function saveVideo(item) {
        const response = await axios.post(
            "http://localhost:3000/api/food/save",
            { foodId: item._id },
            { withCredentials: true }
        )

        setVideos(prev =>
            prev.map(v =>
                v._id === item._id
                    ? { ...v, savesCount: v.savesCount + (response.data.save ? 1 : -1) }
                    : v
            )
        )
    }

    // NOT LOGGED IN → LANDING SCREEN
    if (!isAuthenticated) {
    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f5f8fc'
        }}>
            <div style={{
                backgroundColor: '#ffffff',
                padding: '28px',
                borderRadius: '14px',
                width: '90%',
                maxWidth: '360px',
                textAlign: 'center',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)'
            }}>
                <h2 style={{
                    marginBottom: '6px',
                    color: '#1f3c88',
                    fontWeight: '600'
                }}>
                    Welcome
                </h2>

                <p style={{
                    color: '#6b7280',
                    fontSize: '14px',
                    marginBottom: '22px'
                }}>
                    Continue to explore food reels
                </p>

               <button
    onClick={() => navigate('/user/login')}
    style={{
        width: '100%',
        padding: '12px',
        marginBottom: '6px',
        borderRadius: '10px',
        border: 'none',
        backgroundColor: '#2563eb',
        color: '#ffffff',
        fontSize: '15px',
        fontWeight: '500',
        cursor: 'pointer'
    }}
>
    Login as User
</button>

<p
    onClick={() => navigate('/user/register')}
    style={{
        fontSize: '13px',
        color: '#2563eb',
        cursor: 'pointer',
        marginBottom: '18px'
    }}
>
    New user? Register here
</p>

<button
    onClick={() => navigate('/food-partner/login')}
    style={{
        width: '100%',
        padding: '12px',
        marginBottom: '6px',
        borderRadius: '10px',
        border: '1px solid #2563eb',
        backgroundColor: '#ffffff',
        color: '#2563eb',
        fontSize: '15px',
        fontWeight: '500',
        cursor: 'pointer'
    }}
>
    Login as Food Partner
</button>

<p
    onClick={() => navigate('/food-partner/register')}
    style={{
        fontSize: '13px',
        color: '#2563eb',
        cursor: 'pointer'
    }}
>
    New food partner? Register here
</p>

            </div>
        </div>
    )
}

    // LOGGED IN → SHOW REELS
    return (
        <ReelFeed
            items={videos}
            onLike={likeVideo}
            onSave={saveVideo}
            emptyMessage="No videos available."
        />
    )
}

export default Home
