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
