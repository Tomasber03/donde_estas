package org.example.donde_estas.handler;

import lombok.Getter;
import lombok.Setter;
import org.springframework.validation.FieldError;

import java.util.HashMap;
import java.util.Map;

@Getter @Setter
public class ValidationError {
    private String field;
    private String message;

    public ValidationError(FieldError fieldError) {
        this.field= fieldError.getField(); //Campo que fallo
        this.message = fieldError.getDefaultMessage() != null ?
                fieldError.getDefaultMessage() : "Error de validacion"; //Mensaje del error
    }
    public Map<String,String> toErrorResponse(){
        HashMap<String,String> detalleError = new HashMap<>();
        detalleError.put("field", this.getField());
        detalleError.put("message", this.getMessage());
        return detalleError;
    }
}