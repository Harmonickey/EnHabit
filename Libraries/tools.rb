
class String
    def to_b
        (self.downcase == 'true' || self.downcase == '1')
    end
end

class Float
    def to_rad
        (self * Math::PI / 180)
    end
end