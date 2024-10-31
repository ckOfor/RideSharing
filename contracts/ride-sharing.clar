;; ride-sharing.clar

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-found (err u101))
(define-constant err-already-exists (err u102))

;; Data variables
(define-data-var next-ride-id uint u0)

;; Maps
(define-map users principal bool)
(define-map rides
  uint
  {
    driver: (optional principal),
    rider: principal,
    status: (string-ascii 20)
  }
)

;; Public functions
(define-public (register-user)
  (begin
    (asserts! (is-none (map-get? users tx-sender)) err-already-exists)
    (ok (map-set users tx-sender true))
  )
)

(define-public (request-ride)
  (let
    ((ride-id (var-get next-ride-id)))
    (asserts! (is-some (map-get? users tx-sender)) err-not-found)
    (map-set rides ride-id
      {
        driver: none,
        rider: tx-sender,
        status: "requested"
      }
    )
    (var-set next-ride-id (+ ride-id u1))
    (ok ride-id)
  )
)
