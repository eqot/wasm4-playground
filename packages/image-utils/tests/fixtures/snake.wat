(data (i32.const 0x19a0)
  "\01\00\00\00" "\00\00\00\00" ;; direction (1, 0)
  "\03\00\00\00"                ;; body_length 3
  "\02\00\00\00" "\00\00\00\00" ;; body[0] = (2, 0)
  "\01\00\00\00" "\00\00\00\00" ;; body[1] = (1, 0)
  "\00\00\00\00" "\00\00\00\00" ;; body[2] = (0, 0)
)

(global $frame-count (mut i32) (i32.const 0))
(global $prev-state (mut i32) (i32.const 0))

(data
  (i32.const 0x2638)
  "\00\a0\02\00\0e\f0\36\5c\d6\57\d5\57\35\5c\0f\f0"
)

(func (export "start")
  (i32.store (global.get $PALETTE0) (i32.const 0xfbf7f3))
  (i32.store (global.get $PALETTE1) (i32.const 0xe5b083))
  (i32.store (global.get $PALETTE2) (i32.const 0x426e5d))
  (i32.store (global.get $PALETTE3) (i32.const 0x20283d))

  ;; fruit.x = rnd(20)
  (i32.store (i32.const 0x2630) (call $rnd (i32.const 20)))
  ;; fruit.y = rnd(20)
  (i32.store (i32.const 0x2634) (call $rnd (i32.const 20)))
)

(func (export "update")
  (local $body-length i32)
  (local $tail-offset i32)
  (local $tail-x i32)
  (local $tail-y i32)

  ;; frame-count = frame-count + 1;
  (global.set $frame-count (i32.add (global.get $frame-count) (i32.const 1)))

  (call $input)

  (if (i32.eqz (i32.rem_u (global.get $frame-count) (i32.const 15)))
    (then
      (call $snake-update)

      (if (call $snake-is-dead)
        (then
          ;; Do something
        )
      )

      ;; if (body[0].x == fruit.x && body[0].y == fruit.y)
      (if (i32.and
            (i32.eq (i32.load (i32.const 0x19ac)) (i32.load (i32.const 0x2630)))
            (i32.eq (i32.load (i32.const 0x19b0)) (i32.load (i32.const 0x2634))))
        (then
          ;; Snake's head hits the fruit

          ;; tail-offset = (body-length - 1) * 8
          (local.set $tail-offset
            (i32.mul
              (i32.sub
                (local.tee $body-length
                  (i32.load (i32.const 0x19a8)))
                (i32.const 1))
              (i32.const 8)))

          ;; Increment body_length
          (i32.store
            (i32.const 0x19a8)
            (i32.add
              (local.get $body-length)
              (i32.const 1)))

          ;; Copy tail to next point in body.
          (i32.store offset=0x19b4 (local.get $tail-offset)
            (i32.load offset=0x19ac (local.get $tail-offset)))
          (i32.store offset=0x19b8 (local.get $tail-offset)
            (i32.load offset=0x19b0 (local.get $tail-offset)))

          ;; fruit.x = rnd(20);
          (i32.store (i32.const 0x2630) (call $rnd (i32.const 20)))
          ;; fruit.y = rnd(20);
          (i32.store (i32.const 0x2634) (call $rnd (i32.const 20)))
        )
      )
    )
  )

  (call $snake-draw)

  ;; Set fruit colors.
  (i32.store16 (global.get $DRAW_COLORS) (i32.const 0x4320))

  ;; Draw fruit.
  (call $blit
    (i32.const 0x2638)
    (i32.mul (i32.load (i32.const 0x2630)) (i32.const 8))
    (i32.mul (i32.load (i32.const 0x2634)) (i32.const 8))
    (i32.const 8)
    (i32.const 8)
    (i32.const 1))
)

(func $snake-draw
  (local $offset i32)      ;; offset is initialized to 0
  (local $offset-end i32)

  (i32.store16 (global.get $DRAW_COLORS) (i32.const 0x0043))

  ;; offset-end = body_length * 8
  (local.set $offset-end
    (i32.mul
      (i32.load (i32.const 0x19a8))  ;; body_length
      (i32.const 8)))

  ;; loop over all points in the body
  (loop $loop
    ;; rect(part.x * 8, part.y * 8, 8, 8)
    ;; 
    ;; Note that the array starts at 0x19a4, so the first x-coordinate starts
    ;; at 0x19a4 and the first y-coordinate starts at 0x19a8. We can bake these
    ;; offsets directly into the instruction to reduce the code size.
    (call $rect
      (i32.mul (i32.load offset=0x19ac (local.get $offset)) (i32.const 8))
      (i32.mul (i32.load offset=0x19b0 (local.get $offset)) (i32.const 8))
      (i32.const 8)
      (i32.const 8))

    ;; Add 8 to offset, and loop if offset < offset-end.
    (br_if $loop
      (i32.lt_u
        (local.tee $offset (i32.add (local.get $offset) (i32.const 8)))
        (local.get $offset-end)))
  )

  (i32.store16 (global.get $DRAW_COLORS) (i32.const 0x0004))

  ;; Draw the head.
  (call $rect
    (i32.mul (i32.load (i32.const 0x19ac)) (i32.const 8))
    (i32.mul (i32.load (i32.const 0x19b0)) (i32.const 8))
    (i32.const 8)
    (i32.const 8))
)

(func $snake-update
  (local $offset i32)
  (local $body-x i32)
  (local $body-y i32)

  ;; loop backward from the end to the beginning.
  (local.set $offset
    (i32.mul
      (i32.sub (i32.load (i32.const 0x19a8)) (i32.const 1))
      (i32.const 8)))

  (loop $loop
    ;; body[i].x = body[i - 1].x
    ;;
    ;; The - 8 offset is baked into the i32.load offset.
    (i32.store offset=0x19ac
      (local.get $offset)
      (i32.load offset=0x19a4 (local.get $offset)))

    ;; body[i].y = body[i - 1].y
    (i32.store offset=0x19b0
      (local.get $offset)
      (i32.load offset=0x19a8 (local.get $offset)))

    (br_if $loop
      (i32.gt_s
        (local.tee $offset (i32.sub (local.get $offset) (i32.const 8)))
        (i32.const 0))))

  ;; body[0].x = (body[0].x + direction.x) % 20
  (i32.store
    (i32.const 0x19ac)
    (local.tee $body-x
      (i32.rem_s
        (i32.add
          (i32.load (i32.const 0x19ac))
          (i32.load (i32.const 0x19a0)))
        (i32.const 20))))

  ;; body[0].y = (body[0].y + direction.y) % 20
  (i32.store
    (i32.const 0x19b0)
    (local.tee $body-y
      (i32.rem_s
        (i32.add
          (i32.load (i32.const 0x19b0))
          (i32.load (i32.const 0x19a4)))
        (i32.const 20))))

  ;; if (body[0].x < 0) body[0].x = 19;
  (if (i32.lt_s (local.get $body-x) (i32.const 0))
    (then
      (i32.store (i32.const 0x19ac) (i32.const 19))))

  ;; if (body[0].y < 0) body[0].y = 19;
  (if (i32.lt_s (local.get $body-y) (i32.const 0))
    (then
      (i32.store (i32.const 0x19b0) (i32.const 19))))
)

(func $input
  (local $gamepad i32)
  (local $just-pressed i32)

  ;; gamepad = *GAMEPAD;
  (local.set $gamepad (i32.load8_u (global.get $GAMEPAD1)))

  ;; just-pressed = gamepad & (gamepad ^ prev-state);
  (local.set $just-pressed
    (i32.and
      (local.get $gamepad)
      (i32.xor
        (local.get $gamepad)
        (global.get $prev-state))))

  (if (i32.and (local.get $just-pressed) (global.get $BUTTON_LEFT))
    (then
      (call $snake-left)
    )
  )

  (if (i32.and (local.get $just-pressed) (global.get $BUTTON_RIGHT))
    (then
      (call $snake-right)
    )
  )

  (if (i32.and (local.get $just-pressed) (global.get $BUTTON_UP))
    (then
      (call $snake-up)
    )
  )

  (if (i32.and (local.get $just-pressed) (global.get $BUTTON_DOWN))
    (then
      (call $snake-down)
    )
  )

  (global.set $prev-state (local.get $gamepad))
)

(func $snake-left
  ;; if (direction.y == 0) {
  ;;   direction.x = 0;
  ;;   direction.y = 1;
  ;; }
  (if (i32.eq (i32.load (i32.const 0x19a0)) (i32.const 0))
    (then
      (i32.store (i32.const 0x19a0) (i32.const -1))
      (i32.store (i32.const 0x19a4) (i32.const 0))))
)

(func $snake-right
  ;; if (direction.y == 0) {
  ;;   direction.x = 0;
  ;;   direction.y = 1;
  ;; }
  (if (i32.eq (i32.load (i32.const 0x19a0)) (i32.const 0))
    (then
      (i32.store (i32.const 0x19a0) (i32.const 1))
      (i32.store (i32.const 0x19a4) (i32.const 0))))
)

(func $snake-up
  ;; if (direction.y == 0) {
  ;;   direction.x = 0;
  ;;   direction.y = 1;
  ;; }
  (if (i32.eq (i32.load (i32.const 0x19a4)) (i32.const 0))
    (then
      (i32.store (i32.const 0x19a0) (i32.const 0))
      (i32.store (i32.const 0x19a4) (i32.const -1))))
)

(func $snake-down
  ;; if (direction.y == 0) {
  ;;   direction.x = 0;
  ;;   direction.y = 1;
  ;; }
  (if (i32.eq (i32.load (i32.const 0x19a4)) (i32.const 0))
    (then
      (i32.store (i32.const 0x19a0) (i32.const 0))
      (i32.store (i32.const 0x19a4) (i32.const 1))))
)

;; Initialize the random state to 1234.
(global $random-state (mut i32) (i32.const 1234))

(func $rnd (param $n i32) (result i32)
  (local $x i32)

  ;; x = random-state
  ;; x ^= x << 13
  ;; x ^= x >> 17
  ;; x ^= x << 5
  ;; random-state = x
  (global.set $random-state
    (local.tee $x
      (i32.xor
        (local.tee $x
          (i32.xor
            (local.tee $x
              (i32.xor
                (local.tee $x (global.get $random-state))
                (i32.shl
                  (local.get $x)
                  (i32.const 13))))
            (i32.shr_u
              (local.get $x)
              (i32.const 17))))
        (i32.shl
          (local.get $x)
          (i32.const 5)))))

  ;; convert a random i32 in the range [0, 2**32) to a random f32 in the range
  ;; [0, 1). Then multiply by `n` to convert it to a f32 in the range [0, n).
  ;; Finally convert it back to an i32.
  (i32.trunc_f32_u
    (f32.mul
      (f32.mul
        (f32.convert_i32_u (i32.shr_u (local.get $x) (i32.const 8)))
        (f32.const 0x1p-24))
      (f32.convert_i32_u
        (local.get $n))))
)

(func $snake-is-dead (result i32)
  (local $offset i32)
  (local $offset-end i32)

  ;; offset = 8
  (local.set $offset (i32.const 8))

  ;; offset-end = body_length * 8
  (local.set $offset-end
    (i32.mul
      (i32.load (i32.const 0x19a8))  ;; body_length
      (i32.const 8)))

  ;; loop over all points in the body (except the head)
  (loop $loop
    ;; If the head is at the same place as this piece of the body, then return
    ;; true.
    (if (i32.and
          (i32.eq
            (i32.load (i32.const 0x19ac))
            (i32.load offset=0x19ac (local.get $offset)))
          (i32.eq
            (i32.load (i32.const 0x19b0))
            (i32.load offset=0x19b0 (local.get $offset))))
      (then
        (return (i32.const 1))))

    ;; Add 8 to offset, and loop if offset < offset-end.
    (br_if $loop
      (i32.lt_u
        (local.tee $offset (i32.add (local.get $offset) (i32.const 8)))
        (local.get $offset-end)))
  )

  ;; return false
  (i32.const 0)
)
