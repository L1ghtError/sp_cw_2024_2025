PROGRAM Aaaa ;
BEGIN VAR INT_2 Vvvv , Rrrr , Cccc ;
  Rrrr <- 1
  INPUT (Vvvv)
  FOR  Cccc <- 0 TO 32767 DO
    IF ( Vvvv <> 0 ) ; ELSE GOTO Eeee ;
     Rrrr <- Rrrr * Vvvv
     Vvvv <- Vvvv - 1
  ;
  Eeee :
  OUTPUT ( Rrrr )
END
