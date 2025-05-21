package com.example.meo_meo_shop.service;

import com.example.meo_meo_shop.entity.Review;
import com.example.meo_meo_shop.repository.ReviewRepository;
import org.springframework.stereotype.Service;

@Service
public class ReviewServiceImpl extends AServiceImpl<Review, Long> implements IService<Review, Long>{
    private final ReviewRepository reviewRepository;

    public ReviewServiceImpl(ReviewRepository reviewRepository) {
        super(reviewRepository);
        this.reviewRepository = reviewRepository;
    }

    @Override
    public Review update(Long id, Review updatedReview) {
        Review existing = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found with ID: " + id));

        if (updatedReview.getRating() >= 0) {
            existing.setRating(updatedReview.getRating());
        }
        if (updatedReview.getComment() != null) {
            existing.setComment(updatedReview.getComment());
        }
        if (updatedReview.getProduct() != null) {
            existing.setProduct(updatedReview.getProduct());
        }
        if (updatedReview.getUser() != null) {
            existing.setUser(updatedReview.getUser());
        }

        return reviewRepository.save(existing);
    }
}
