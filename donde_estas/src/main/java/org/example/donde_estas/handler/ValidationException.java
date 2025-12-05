package org.example.donde_estas.handler;

import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;
import org.springframework.validation.FieldError;

import java.util.*;
import java.util.stream.Collectors;

//Clase para tratar las expeciones de validaciones default del framework
@Getter @Setter
public class ValidationException extends RuntimeException{
    private List<ValidationError> errors;
    private HttpStatus status;

    public ValidationException(List<FieldError> exceptionErrors, HttpStatus status){
        super("Error de validación");
        this.status = status;
        this.setValidationErrors(exceptionErrors);
    }
    private void setValidationErrors (List<FieldError> exceptionErrors){
        //Itera sobre cada erorr y crea un ValidationError por cada uno
        this.errors = exceptionErrors.stream().map(
                        fieldError -> new ValidationError(fieldError))
                .collect(Collectors.toList());
    }

    public Map<String, Object> toErrorResponse() {
        // Lista de errores con estructura {field, message}
        List<Map<String, String>> errorDetails = this.errors.stream()
                .map(error -> {
                    return error.toErrorResponse();
                })
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("errors", errorDetails);
        return response;
    }
}