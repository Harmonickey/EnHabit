
class String
    def to_b
        (self.downcase == 'true' || self.downcase == '1')
    end
end

class Float
    def to_rad
<<<<<<< HEAD
<<<<<<< HEAD
        (self * Math::PI / 180)
    end
end

def ComputeDistance(lat1, lon1, lat2, lon2)

    phi1 = lat1.to_f.to_rad
    phi2 = lat2.to_f.to_rad
    deltaphi = (lat2.to_f - lat1.to_f).to_rad
<<<<<<< HEAD
<<<<<<< HEAD
    deltalambda = (lon2.to_f - lon1.to_f).to_rad
=======
    deltalamba = (lon2.to_f - lon1.to_f).to_rad
>>>>>>> 6d6307e... 119 move to tools.rb
=======
    deltalambda = (lon2.to_f - lon1.to_f).to_rad
>>>>>>> bf764e0... 119 seriously... spelled wrong

    a = Math.sin(deltaphi/2) * Math.sin(deltaphi/2) + Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltalambda/2) * Math.sin(deltalambda/2);
    c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

    d = 6371000 * c # meters
    
    return d * 0.000621371; # to miles
<<<<<<< HEAD
=======
        (self * Math.PI / 180)
=======
        (self * Math::PI / 180)
>>>>>>> 5e3986d... 119 we needed the PI from Math
    end
>>>>>>> 33457ff... 119 getting distance calculations
=======
>>>>>>> 6d6307e... 119 move to tools.rb
end