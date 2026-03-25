import { useEffect, useState } from "react";
import "./ReviewBox.css";

function ReviewBox({ productName }) {

  const user = JSON.parse(localStorage.getItem("user"));

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);
  const [msg, setMsg] = useState("");

  const [canReview, setCanReview] = useState(false);
  const [avgRating, setAvgRating] = useState(0);


 useEffect(() => {

  let isMounted = true;

  async function loadData() {

    try {

      // Load reviews
      const res1 = await fetch(
        `http://localhost:5000/api/reviews/${productName}`
      );

      const data1 = await res1.json();

      if (isMounted) {

        setReviews(data1);

        if (data1.length > 0) {
          const sum = data1.reduce((a, b) => a + b.rating, 0);
          setAvgRating((sum / data1.length).toFixed(1));
        } else {
          setAvgRating(0);
        }
      }


      // Check purchase
      if (user?.id) {

        const res2 = await fetch(
          `http://localhost:5000/api/reviews/check/${user.id}/${productName}`
        );

        const data2 = await res2.json();

        if (isMounted) {
          setCanReview(data2.bought);
        }
      }

    } catch (err) {
      console.log(err);
    }

  }

  if (productName) {
    loadData();
  }


  return () => {
    isMounted = false;
  };

}, [productName, user?.id]);


  // Submit review
  async function submitReview() {

    if (!canReview) {
      setMsg("You must buy before reviewing");
      return;
    }

    const res = await fetch("http://localhost:5000/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user.id,
        productName,
        rating,
        comment,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMsg(data.error);
      return;
    }

    setMsg("Review added ✅");
    setComment("");


    // Reload after submit
    fetch(`http://localhost:5000/api/reviews/${productName}`)
      .then(res => res.json())
      .then(data => {

        setReviews(data);

        if (data.length > 0) {
          const sum = data.reduce((a, b) => a + b.rating, 0);
          setAvgRating((sum / data.length).toFixed(1));
        } else {
          setAvgRating(0);
        }

      });
  }


  return (

<div className="review-box elevated-card">

<h3 className="review-title">
Customer Reviews
</h3>


{/* Average Rating */}

<div className="review-summary">

<div className="review-stars">
{"⭐".repeat(Math.round(avgRating || 0))}
</div>

<div className="review-score">
{reviews.length > 0 ? (
<span>{avgRating} / 5 ({reviews.length} reviews)</span>
) : (
<span>No ratings yet</span>
)}

</div>

</div>


{/* REVIEW FORM */}

{user && canReview && (

<div className="review-form">

<h4>Write a Review</h4>

<select
value={rating}
onChange={(e)=>setRating(parseInt(e.target.value))}
className="review-select"
>

<option value="5">⭐⭐⭐⭐⭐ Excellent</option>
<option value="4">⭐⭐⭐⭐ Good</option>
<option value="3">⭐⭐⭐ Average</option>
<option value="2">⭐⭐ Poor</option>
<option value="1">⭐ Bad</option>

</select>

<textarea
placeholder="Share your experience with this product..."
value={comment}
onChange={(e)=>setComment(e.target.value)}
className="review-textarea"
/>

<button
onClick={submitReview}
className="review-btn"
>

Submit Review

</button>

{msg && <p className="review-msg">{msg}</p>}

</div>

)}


{user && !canReview && (
<p className="review-hint">
Buy this product to write a review
</p>
)}


<hr className="review-divider"/>


{/* REVIEWS */}

<div className="reviews-list">

{reviews.map((r)=> (

<div key={r.id} className="review-item">

<div className="review-avatar">
{r.user_name ? r.user_name[0].toUpperCase() : "U"}
</div>

<div className="review-content">

<div className="review-rating">
{"⭐".repeat(r.rating)}
</div>

<p className="review-comment">
{r.comment}
</p>

</div>

</div>

))}

</div>

</div>

);
}

export default ReviewBox;
