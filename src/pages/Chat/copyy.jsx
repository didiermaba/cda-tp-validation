import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import confetti from 'canvas-confetti'
import OpenAI from 'openai'
import config from '../../../config'



            
function Chat() {
    const location = useLocation()
    const navigate = useNavigate()
    const formData = location.state?.formData
    const [userQuestion, setUserQuestion] = useState('')
    const [botResponse, setBotResponse] = useState('')

    useEffect(() => {
        if (formData.name && formData.subject) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
            })
        } else {
            navigate('/')
        }
    }, [formData, navigate])

    // Initialise l'API OpenAI
    const openai = new OpenAI({
        apiKey: config.OPENAI_API_KEY,
        dangerouslyAllowBrowser: true,
    })

    // Fonction pour gérer l'envoi de la question à l'API et recevoir la réponse
    const handleQuestionSubmission = async event => {
        event.preventDefault()
        try {
            // Utilise l'API OpenAI pour obtenir la réponse
            const response = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: `Je m'appelle ${formData.name}.`,
                    },
                    { role: 'user', content: userQuestion },
                ],
            })
            // console.log(response.choices[0].message)
            // console.log(response.choices[0].message.content)
            setBotResponse(response.choices[0].message.content) // Définit la réponse du bot
        } catch (error) {
            console.error('Error:', error)
        }
    }

    if (!formData) {
        return null
    }

        /** - Faire un objet contenant toutes les réponses reçues avec une boucle qui passe en revue toute les réponses 
         *    et crée une balise <p> pour chacune.
         *  - Ajuster le css 
        */
    
    return (
        <main className="text-center">
            <h1 className="form-signin col-md-6 col-sm-10 m-auto mb-3">
                Bienvenue, {formData.name}
            </h1>
            <h3>Pose-moi tes questions sur {formData.subject}</h3>
            <form onSubmit={handleQuestionSubmission}>
                <div className="form-floating mb-3">
                    <textarea
                        className="form-control"
                        placeholder="Pose ta question ici"
                        value={userQuestion}
                        onChange={e => setUserQuestion(e.target.value)}
                    ></textarea>
                </div>
                <button className="btn btn-warning rounded-pill" type="submit">
                    Envoyer
                </button>
            </form>
            
            {botResponse && (
                <div className="mt-3">
                    <p>Réponse de l'IA:</p>
                    <p>{botResponse}</p>
                </div>
            )}
        </main>
    )
}

export default Chat