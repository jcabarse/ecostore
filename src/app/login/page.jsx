      if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            // The database trigger turns this into the user's profile
            data: {
              first_name: firstName,
              last_name: lastName,
              phone_number: phone,
              country,
              display_name: `${firstName} ${lastName}`.trim(),
            },
          },
        });
        if (signUpError) throw signUpError;

        // If email confirmation is on in Supabase, there is no session yet
        if (!data.session) {
          alert('Account created! Please check your email to confirm, then log in.');
          setIsSignUp(false);
          return;
        }
        alert('Account created successfully! You are now logged in.');
