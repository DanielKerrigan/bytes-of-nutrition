with open('temp.txt') as f:
    s = f.readline()
    s = s.split(',')
    for a in s:
        print(a.strip().title())
