import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getSupabaseClient } from '../lib/supabaseClient'

const initialForm = {
  name: '',
  url: '',
  description: '',
  imageURL: '',
}

function AddCreatorPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState(initialForm)
  const [error, setError] = useState('')

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    try {
      const client = getSupabaseClient()
      const { error: insertError } = await client.from('creators').insert([formData])
      if (insertError) {
        throw insertError
      }

      navigate('/')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section>
      <h1>Add Creator</h1>
      <form onSubmit={handleSubmit} className="creator-form">
        <label htmlFor="name">Name</label>
        <input id="name" name="name" value={formData.name} onChange={handleChange} required />

        <label htmlFor="url">URL</label>
        <input id="url" name="url" type="url" value={formData.url} onChange={handleChange} required />

        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <label htmlFor="imageURL">Image URL (optional)</label>
        <input
          id="imageURL"
          name="imageURL"
          type="url"
          value={formData.imageURL}
          onChange={handleChange}
        />

        {error ? <p role="alert">{error}</p> : null}

        <div className="form-actions">
          <button type="submit">Create Creator</button>
          <Link to="/">Cancel</Link>
        </div>
      </form>
    </section>
  )
}

export default AddCreatorPage
