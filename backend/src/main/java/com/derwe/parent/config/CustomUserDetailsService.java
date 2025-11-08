package com.derwe.parent.config;

import com.derwe.parent.model.Padre;
import com.derwe.parent.repository.PadreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    
    private final PadreRepository padreRepository;
    
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Padre padre = padreRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con email: " + email));
        
        return User.builder()
                .username(padre.getEmail())
                .password(padre.getPassword())
                .authorities(new ArrayList<>())
                .accountExpired(false)
                .accountLocked(!padre.getActivo())
                .credentialsExpired(false)
                .disabled(!padre.getActivo())
                .build();
    }
}
