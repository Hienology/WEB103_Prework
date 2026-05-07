import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getSupabaseClient } from '../lib/supabaseClient'

const initialForm = {
  name: '',
  url: '',
  description: '',
  imageURL: '',
}

function EditCreatorPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState(initialForm)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchCreator() {
      try {
        const client = getSupabaseClient()
        const { data, error: fetchError } = await client
          .from('creators')
          .select('*')
          .eq('id', id)
          .single()

        if (fetchError) {
          throw fetchError
        }

        setFormData({
          name: data.name ?? '',
          url: data.url ?? '',
          description: data.description ?? '',
          imageURL: data.imageURL ?? '',
        })
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCreator()
  }, [id])

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
      const { error: updateError } = await client.from('creators').update(formData).eq('id', id)
      if (updateError) {
        throw updateError
      }

      navigate(`/creators/${id}`)
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDelete() {
    const shouldDelete = window.confirm('Delete this creator? This action cannot be undone.')
    if (!shouldDelete) {
      return
    }

    try {
      const client = getSupabaseClient()
      const { error: deleteError } = await client.from('creators').delete().eq('id', id)
      if (deleteError) {
        throw deleteError
      }

      navigate('/')
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) {
    return <p>Loading creator...</p>
  }

  return (
    <section>
      <h1>Edit Creator</h1>
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
          <button type="submit">Save Changes</button>
          <button type="button" onClick={handleDelete}>
            Delete Creator
          </button>
          <Link to={`/creators/${id}`}>Back to Details</Link>
        </div>
      </form>
    </section>
  )
}

export default EditCreatorPage
