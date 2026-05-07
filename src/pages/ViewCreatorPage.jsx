import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getSupabaseClient } from '../lib/supabaseClient'

function ViewCreatorPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [creator, setCreator] = useState(null)
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

        setCreator(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCreator()
  }, [id])

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

  if (error) {
    return (
      <section>
        <p role="alert">{error}</p>
        <Link to="/">Back to home</Link>
      </section>
    )
  }

  if (!creator) {
    return (
      <section>
        <p>Creator not found.</p>
        <Link to="/">Back to home</Link>
      </section>
    )
  }

  return (
    <section>
      <h1>{creator.name}</h1>
      {creator.imageURL ? (
        <img src={creator.imageURL} alt={creator.name} className="detail-image" />
      ) : null}
      <p>{creator.description}</p>
      <p>
        <a href={creator.url} target="_blank" rel="noreferrer">
          Open creator page
        </a>
      </p>
      <div className="detail-actions">
        <Link to="/">Back to home</Link>
        <Link to={`/creators/${id}/edit`}>Edit Creator</Link>
        <button type="button" onClick={handleDelete}>
          Delete Creator
        </button>
      </div>
    </section>
  )
}

export default ViewCreatorPage
