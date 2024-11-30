import { describe, it, expect, beforeEach } from 'vitest';

// Mock implementation of the ride-rating contract
const RideRatingContract = {
  rideRatings: new Map(),
  rideSharing: {
    getRide: (rideId) => {
      // Mock implementation of ride-sharing contract's get-ride function
      if (rideId === 1) {
        return {
          driver: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
          rider: 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG',
          status: 'completed'
        };
      }
      return null;
    }
  },
  
  rateRide(rideId, rating, review, sender) {
    if (rideId !== 1) throw new Error('err-not-found');
    if (rating < 1 || rating > 5) throw new Error('err-invalid-rating');
    
    const ride = this.rideSharing.getRide(rideId);
    const existingRating = this.rideRatings.get(rideId) || {};
    
    if (sender === ride.rider) {
      this.rideRatings.set(rideId, {
        ...existingRating,
        riderRating: rating,
        riderReview: review
      });
    } else if (sender === ride.driver) {
      this.rideRatings.set(rideId, {
        ...existingRating,
        driverRating: rating,
        driverReview: review
      });
    } else {
      throw new Error('err-not-found');
    }
    
    return { success: true };
  },
  
  getRideRating(rideId) {
    return this.rideRatings.get(rideId) || null;
  }
};

describe('Ride Rating Contract', () => {
  beforeEach(() => {
    RideRatingContract.rideRatings.clear();
  });
  
  describe('Rate Ride', () => {
    it('should allow rider to rate a ride', () => {
      const result = RideRatingContract.rateRide(1, 4, 'Great ride!', 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG');
      expect(result.success).toBe(true);
      
      const rating = RideRatingContract.getRideRating(1);
      expect(rating.riderRating).toBe(4);
      expect(rating.riderReview).toBe('Great ride!');
    });
    
    it('should allow driver to rate a ride', () => {
      const result = RideRatingContract.rateRide(1, 5, 'Excellent passenger', 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM');
      expect(result.success).toBe(true);
      
      const rating = RideRatingContract.getRideRating(1);
      expect(rating.driverRating).toBe(5);
      expect(rating.driverReview).toBe('Excellent passenger');
    });
    
    it('should not allow rating for non-existent ride', () => {
      expect(() => RideRatingContract.rateRide(2, 4, 'Great ride!', 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG')).toThrow('err-not-found');
    });
    
    it('should not allow invalid ratings', () => {
      expect(() => RideRatingContract.rateRide(1, 0, 'Bad ride', 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG')).toThrow('err-invalid-rating');
      expect(() => RideRatingContract.rateRide(1, 6, 'Great ride!', 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG')).toThrow('err-invalid-rating');
    });
    
    it('should not allow non-participants to rate a ride', () => {
      expect(() => RideRatingContract.rateRide(1, 4, 'Great ride!', 'ST3PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM')).toThrow('err-not-found');
    });
  });
  
  describe('Get Ride Rating', () => {
    it('should return null for non-existent ride ratings', () => {
      const rating = RideRatingContract.getRideRating(2);
      expect(rating).toBeNull();
    });
    
    it('should return complete ride rating', () => {
      RideRatingContract.rateRide(1, 4, 'Great ride!', 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG');
      RideRatingContract.rateRide(1, 5, 'Excellent passenger', 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM');
      
      const rating = RideRatingContract.getRideRating(1);
      expect(rating).toEqual({
        riderRating: 4,
        riderReview: 'Great ride!',
        driverRating: 5,
        driverReview: 'Excellent passenger'
      });
    });
  });
});
