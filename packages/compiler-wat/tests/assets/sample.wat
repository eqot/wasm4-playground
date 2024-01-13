;; smiley
(data (i32.const 0x19a0) "\c3\81\24\24\00\24\99\c3")

(data (i32.const 0x19a8) "Hello from Wat!\00")

(data (i32.const 0x19b8) "Press X to blink\00")

(func (export "start")
)

(func (export "update")
  (local $gamepad i32)

  ;; *DRAW_COLORS = 2
  (i32.store16 (global.get $DRAW_COLORS) (i32.const 2))

  ;; text("Hello from Wat!", 10, 10);
  (call $text (i32.const 0x19a8) (i32.const 10) (i32.const 10))

  ;; uint8_t gamepad = *GAMEPAD1;
  (local.set $gamepad (i32.load8_u (global.get $GAMEPAD1)))

  ;; if (gamepad & BUTTON_1) {
  ;;     *DRAW_COLORS = 4;
  ;; }
  (if (i32.and (local.get $gamepad) (global.get $BUTTON_1))
    (then
      (i32.store16 (global.get $DRAW_COLORS) (i32.const 4))
    ))

  ;; blit(smiley, 76, 76, 8, 8, BLIT_1BPP);
  (call $blit (i32.const 0x19a0) (i32.const 76) (i32.const 76) (i32.const 8) (i32.const 8) (global.get $BLIT_1BPP))

  ;; text("Press X to blink", 16, 90);
  (call $text (i32.const 0x19b8) (i32.const 16) (i32.const 90))
)
