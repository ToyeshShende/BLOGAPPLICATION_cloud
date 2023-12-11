// import React, { useEffect } from 'react';
import { formatISO9075 } from 'date-fns';
import { Link } from 'react-router-dom';

export default function Post({ _id, title, summary, cover, content, createdAt, author, prevPost, nextPost }) {
  return (
    <div>
      <div className="post">
        <div className="image">
          <Link to={`/post/${_id}`}>
            <img src={cover} alt='loading'></img>
          </Link>
        </div>
        <div className="text">
          <Link to={`/post/${_id}`}>
            <h2>{title} </h2>
          </Link>
          <p className="info">
            <p className="author">
              {author.username}
              <span className="date"> {formatISO9075(new Date(createdAt))}</span>
            </p>
          </p>
          <p className="summary">{summary}</p>
        </div>
      </div>
      {/* Next and Previous buttons */}
      <div className="navigation-buttons">
        {prevPost && (
          <Link to={`/post/${prevPost._id}`} className="prev-button">
            &lt; Previous Post
          </Link>
        )}
        {nextPost && (
          <Link to={`/post/${nextPost._id}`} className="next-button">
            Next Post &gt;
          </Link>
        )}
      </div>
    </div>
  );
}
