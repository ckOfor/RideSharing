;; ride-rating.clar

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-found (err u101))
(define-constant err-already-exists (err u102))
(define-constant err-invalid-rating (err u103))

;; Maps
(define-map ride-ratings
  uint
  {
    rider-rating: (optional uint),
    driver-rating: (optional uint),
    rider-review: (optional (string-utf8 280)),
    driver-review: (optional (string-utf8 280))
  }
)

;; Public functions
(define-public (rate-ride (ride-id uint) (rating uint) (review (optional (string-utf8 280))))
  (let
    ((existing-rating (unwrap! (map-get? ride-ratings ride-id) err-not-found))
     (ride (unwrap! (contract-call? .ride-sharing get-ride ride-id) err-not-found)))
    (asserts! (and (>= rating u1) (<= rating u5)) err-invalid-rating)
    (if (is-eq tx-sender (get rider ride))
      (ok (map-set ride-ratings ride-id
        (merge existing-rating
          {
            rider-rating: (some rating),
            rider-review: review
          }
        )))
      (if (is-eq (some tx-sender) (get driver ride))
        (ok (map-set ride-ratings ride-id
          (merge existing-rating
            {
              driver-rating: (some rating),
              driver-review: review
            }
          )))
        err-not-found
      )
    )
  )
)

;; Read-only functions
(define-read-only (get-ride-rating (ride-id uint))
  (map-get? ride-ratings ride-id)
)
