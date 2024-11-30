import { describe, expect, it, beforeEach } from 'vitest';

// Mock blockchain state
let users: Map<string, boolean> = new Map();
let rides: Map<number, { driver: string | null, rider: string, status: string }> = new Map();
let nextRideId = 0;

// Mock contract functions
function registerUser(sender: string): { type: 'ok' | 'err', value: boolean | number } {
  if (users.has(sender)) {
    return { type: 'err', value: 102 }; // err-already-exists
  }
  users.set(sender, true);
  return { type: 'ok', value: true };
}

function requestRide(sender: string): { type: 'ok' | 'err', value: number } {
  if (!users.has(sender)) {
    return { type: 'err', value: 101 }; // err-not-found
  }
  const rideId = nextRideId++;
  rides.set(rideId, { driver: null, rider: sender, status: 'requested' });
  return { type: 'ok', value: rideId };
}

function acceptRide(sender: string, rideId: number): { type: 'ok' | 'err', value: boolean | number } {
  if (!users.has(sender)) {
    return { type: 'err', value: 101 }; // err-not-found
  }
  const ride = rides.get(rideId);
  if (!ride) {
    return { type: 'err', value: 101 }; // err-not-found
  }
  if (ride.driver !== null) {
    return { type: 'err', value: 102 }; // err-already-exists
  }
  rides.set(rideId, { ...ride, driver: sender, status: 'accepted' });
  return { type: 'ok', value: true };
}

function getRide(rideId: number): { driver: string | null, rider: string, status: string } | null {
  return rides.get(rideId) || null;
}

function isUserRegistered(user: string): boolean {
  return users.has(user);
}

// Tests
describe('ride-sharing', () => {
  beforeEach(() => {
    users.clear();
    rides.clear();
    nextRideId = 0;
  });
  
  describe('register-user', () => {
    it('succeeds when registering a new user', () => {
      const result = registerUser('user1');
      expect(result).toEqual({ type: 'ok', value: true });
      expect(isUserRegistered('user1')).toBe(true);
    });
    
    it('fails when trying to register an already registered user', () => {
      registerUser('user1');
      const result = registerUser('user1');
      expect(result).toEqual({ type: 'err', value: 102 });
    });
  });
  
  describe('request-ride', () => {
    it('succeeds when a registered user requests a ride', () => {
      registerUser('user1');
      const result = requestRide('user1');
      expect(result).toEqual({ type: 'ok', value: 0 });
      expect(rides.get(0)).toEqual({ driver: null, rider: 'user1', status: 'requested' });
    });
    
    it('fails when an unregistered user tries to request a ride', () => {
      const result = requestRide('user1');
      expect(result).toEqual({ type: 'err', value: 101 });
    });
  });
  
  describe('accept-ride', () => {
    it('succeeds when a registered user accepts an existing ride', () => {
      registerUser('user1');
      registerUser('user2');
      requestRide('user1');
      const result = acceptRide('user2', 0);
      expect(result).toEqual({ type: 'ok', value: true });
      expect(rides.get(0)).toEqual({ driver: 'user2', rider: 'user1', status: 'accepted' });
    });
    
    it('fails when trying to accept a non-existent ride', () => {
      registerUser('user1');
      const result = acceptRide('user1', 999);
      expect(result).toEqual({ type: 'err', value: 101 });
    });
    
    it('fails when an unregistered user tries to accept a ride', () => {
      registerUser('user1');
      requestRide('user1');
      const result = acceptRide('user2', 0);
      expect(result).toEqual({ type: 'err', value: 101 });
    });
    
    it('fails when trying to accept an already accepted ride', () => {
      registerUser('user1');
      registerUser('user2');
      registerUser('user3');
      requestRide('user1');
      acceptRide('user2', 0);
      const result = acceptRide('user3', 0);
      expect(result).toEqual({ type: 'err', value: 102 });
    });
  });
  
  describe('get-ride', () => {
    it('returns the correct ride information', () => {
      registerUser('user1');
      registerUser('user2');
      requestRide('user1');
      acceptRide('user2', 0);
      const ride = getRide(0);
      expect(ride).toEqual({ driver: 'user2', rider: 'user1', status: 'accepted' });
    });
    
    it('returns null for a non-existent ride', () => {
      const ride = getRide(999);
      expect(ride).toBeNull();
    });
  });
  
  describe('is-user-registered', () => {
    it('returns true for a registered user', () => {
      registerUser('user1');
      const result = isUserRegistered('user1');
      expect(result).toBe(true);
    });
    
    it('returns false for an unregistered user', () => {
      const result = isUserRegistered('user1');
      expect(result).toBe(false);
    });
  });
});
