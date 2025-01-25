PROGRAM Aaaa ; 
BEGIN VAR INT_2 Vali , Devi , Rema , Cyca , Cycb , Cycc ;
  INPUT ( Vali )
  Vali <- Vali + 1
  FOR  Cyca <- 0 TO 32767 DO
    Devi <- Vali - 1
    FOR  Cycb <- 0 TO 32767 DO 
      IF ( Devi GTE 2 ) ; ELSE GOTO Endb ;
      Rema <- Vali
      FOR  Cycc <- 0 TO 32767 DO
        IF ( Rema GTE Devi ) ; ELSE GOTO Endc ;
        Rema <- Rema - Devi
      ;
      Endc :
      IF ( Rema = 0 ) GOTO Endb ;
      Devi <- Devi - 1
    ;
    Endb :
    IF ( Devi = 1 ) GOTO Enda ;
    Vali <- Vali + 1
  ;
  Enda :
  OUTPUT ( Vali )
END
