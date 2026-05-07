import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CreatorCard from '../components/CreatorCard'
import { getSupabaseClient } from '../lib/supabaseClient'

function HomePage() {
  const [creators, setCreators] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchCreators() {
      try {
        const client = getSupabaseClient()
        const { data, error: fetchError } = await client
          .from('creators')
          .select('*')
          .order('name', { ascending: true })

        if (fetchError) {
          throw fetchError
        }

        setCreators(data ?? [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCreators()
  }, [])

  return (
    <section>
      <div className="page-header">
        <h1>Creatorverse</h1>
        <Link to="/new">Add Creator</Link>
      </div>

      {loading ? <p>Loading creators...</p> : null}
      {error ? <p role="alert">{error}</p> : null}
      {!loading && !error && creators.length === 0 ? (
        <p>No creators found. Add your first creator to get started.</p>
      ) : null}

      <div className="creator-grid">
        {creators.map((creator) => (
          <CreatorCard key={creator.id} {...creator} />
        ))}
      </div>
    </section>
  )
}

export default HomePage
