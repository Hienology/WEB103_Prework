import { Link } from 'react-router-dom'

function CreatorCard({ id, name, url, description, imageURL }) {
  return (
    <article className="creator-card">
      {imageURL ? <img src={imageURL} alt={name} className="creator-image" /> : null}
      <h2>{name}</h2>
      <p>{description}</p>
      <a href={url} target="_blank" rel="noreferrer">
        Visit Channel
      </a>
      <div className="card-actions">
        <Link to={`/creators/${id}`}>View Details</Link>
        <Link to={`/creators/${id}/edit`}>Edit</Link>
      </div>
    </article>
  )
}

export default CreatorCard
