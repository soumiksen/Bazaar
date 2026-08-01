package com.bazaar.backend.exception;

public class CheckoutSessionCreationException extends RuntimeException {
    public CheckoutSessionCreationException(String message, Throwable cause) {
        super(message, cause);
    }
}
