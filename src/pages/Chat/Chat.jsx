import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import confetti from 'canvas-confetti'
import { OpenAI } from 'openai'
import config from '../../../config'

function Chat() {
    const location = useLocation()
    const navigate = useNavigate()
    const formData = location.state?.formData

    const openai = new OpenAI({
        apiKey: config.REACT_APP_OPENAI_API_KEY, // defaults to process.env["OPENAI_API_KEY"]
        dangerouslyAllowBrowser: true,
    })

    const [prompt, setPrompt] = useState('')
    const [apiResponse, setApiResponse] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (formData?.name && formData?.subject) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
            })
        } else {
            navigate('/')
        }
    }, [formData, navigate])

    const handleSubmit = async e => {
        e.preventDefault()
        setLoading(true)
        try {
            const result = await openai.chat.completions.create({
                messages: [{ role: 'user', content: prompt }],
                model: 'gpt-3.5-turbo',
            })
            console.log(result)
            setApiResponse(result.choices[0].message.content)
        } catch (e) {
            setApiResponse('Something is going wrong, Please try again.')
        }
        setLoading(false)
    }

    if (!formData) {
        return null
    }

    return (
        <main className="text-center">
            <h1 className="form-signin col-md-6 col-sm-10 m-auto mb-3">
                Bienvenue, {formData.name}
            </h1>
            <h3>Pose-moi tes questions sur {formData.subject}</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-floating mb-3">
                    <textarea
                        className="form-control"
                        value={prompt}
                        placeholder="Pose ta question ici"
                        onChange={e => setPrompt(e.target.value)}
                    ></textarea>
                </div>
                <button
                    className="btn btn-warning rounded-pill"
                    type="submit"
                    disabled={loading || prompt.length === 0}
                >
                    {loading ? 'Generating...' : 'Envoyer'}
                </button>
            </form>
            {apiResponse && (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <pre>
                        <strong>API response:</strong>
                        {apiResponse}
                    </pre>
                </div>
            )}
        </main>
    )
}

export default Chat
